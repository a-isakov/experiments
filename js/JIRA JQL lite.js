// ==UserScript==
// @name         JIRA JQL lite
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  lightweight JQL search page at /jql-lite (hijacks the static 404 page) with autocomplete and validation, plus a top-nav button on every Jira page that opens it in a new tab
// @author       You
// @match        https://tinypass.atlassian.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const PAGE_PATH = '/jql-lite';
    const CACHE_KEY = 'jql-lite-acdata-v2';
    const OLD_CACHE_KEY = 'jql-lite-acdata';
    const CACHE_TTL = 24 * 60 * 60 * 1000;
    const MAX_ITEMS = 15;
    const SUGGEST_DELAY = 150;

    // ------------------------------------------------------------------
    // Mode B: top-nav button that opens the lite page in a new tab
    // ------------------------------------------------------------------

    function initNavButton() {
        let queued = false;
        const schedule = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                ensureButton();
            });
        };
        // The nav is rendered (and re-rendered) by React, so watch for it instead of waiting for a single event
        new MutationObserver(schedule).observe(document.documentElement || document, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', ensureButton);
    }

    function ensureButton() {
        const header = document.querySelector('header#jira-page-layout-top-nav');
        if (!header || header.querySelector('[data-jql-lite-navbtn]')) return;
        const anchor = header.querySelector('[data-testid="atlassian-navigation--product-home--container"]');
        if (!anchor || !anchor.parentNode) return;

        const wrap = document.createElement('div');
        wrap.setAttribute('data-jql-lite-navbtn', '1');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'JQL search (lite)');
        btn.title = 'JQL search (lite)';

        // borrow the look of a neighbouring nav button so ours blends in
        const ref = header.querySelector('[data-pit-navbtn] button') ||
            header.querySelector('#app-switcher-confluence-ap-ads-spotlight button');
        if (ref) {
            btn.className = ref.className;
        } else {
            btn.style.cssText = 'background:transparent;border:0;width:32px;height:32px;cursor:pointer;border-radius:4px;color:inherit';
        }

        const icon = document.createElement('span');
        icon.setAttribute('aria-hidden', 'true');
        icon.style.cssText = 'display:inline-flex;color:currentColor';
        icon.appendChild(buildSearchIcon());
        btn.appendChild(icon);

        const open = e => {
            e.preventDefault();
            window.open(PAGE_PATH, '_blank');
        };
        btn.addEventListener('click', open);
        btn.addEventListener('auxclick', e => {
            if (e.button === 1) open(e);
        });

        wrap.appendChild(btn);
        anchor.parentNode.insertBefore(wrap, anchor);
    }

    // magnifier: circle + handle (built with createElementNS, no innerHTML on Jira pages)
    function buildSearchIcon() {
        const NS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 16 16');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentcolor');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('stroke-linecap', 'round');
        const circle = document.createElementNS(NS, 'circle');
        circle.setAttribute('cx', '7');
        circle.setAttribute('cy', '7');
        circle.setAttribute('r', '4.5');
        const handle = document.createElementNS(NS, 'path');
        handle.setAttribute('d', 'M10.5 10.5L14 14');
        svg.appendChild(circle);
        svg.appendChild(handle);
        return svg;
    }

    // ------------------------------------------------------------------
    // Mode A: the /jql-lite page
    // ------------------------------------------------------------------

    const PAGE_CSS = `
        :root {
            color-scheme: light dark;
            --bg: #ffffff;
            --fg: #172b4d;
            --muted: #6b778c;
            --border: #c1c7d0;
            --accent: #0c66e4;
            --accent-fg: #ffffff;
            --panel: #ffffff;
            --sel: #e9f2ff;
            --err-bg: #ffeceb;
            --err-fg: #ae2a19;
        }
        @media (prefers-color-scheme: dark) {
            :root {
                --bg: #1d2125;
                --fg: #b6c2cf;
                --muted: #8c9bab;
                --border: #454f59;
                --accent: #579dff;
                --accent-fg: #1d2125;
                --panel: #22272b;
                --sel: #1c2b41;
                --err-bg: #42221f;
                --err-fg: #fd9891;
            }
        }
        body {
            margin: 0;
            background: var(--bg);
            color: var(--fg);
            font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }
        #jql-lite { max-width: 900px; margin: 0 auto; padding: 32px 16px; }
        h1 { font-size: 20px; font-weight: 600; margin: 0 0 16px; }
        .box { position: relative; }
        textarea {
            box-sizing: border-box;
            display: block;
            width: 100%;
            min-height: 72px;
            padding: 8px 10px;
            resize: none;
            overflow: hidden;
            background: var(--panel);
            color: var(--fg);
            border: 1px solid var(--border);
            border-radius: 4px;
            font: 14px/1.5 ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace;
        }
        textarea:focus { outline: 2px solid var(--accent); outline-offset: -1px; }
        #jql-dd {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            box-sizing: border-box;
            min-width: 240px;
            max-width: 420px;
            width: max-content;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 6px;
            box-shadow: 0 4px 8px rgba(9, 30, 66, 0.25);
            max-height: 320px;
            overflow-y: auto;
        }
        #jql-dd[hidden] { display: none; }
        .item { padding: 6px 10px; cursor: pointer; }
        .item.sel { background: var(--sel); }
        .item .name { font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item .name b { font-weight: 700; }
        .item .sub { color: var(--muted); font-size: 12px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .row { display: flex; align-items: center; gap: 16px; margin-top: 12px; }
        button#jql-go {
            padding: 6px 16px;
            background: var(--accent);
            color: var(--accent-fg);
            border: 0;
            border-radius: 4px;
            font: inherit;
            font-weight: 500;
            cursor: pointer;
        }
        button#jql-go:disabled { opacity: 0.7; cursor: default; }
        .hint { color: var(--muted); font-size: 12px; }
        #jql-err { margin-top: 12px; padding: 8px 12px; background: var(--err-bg); color: var(--err-fg); border-radius: 4px; }
        #jql-err[hidden] { display: none; }
        #jql-err ul { margin: 0 0 4px; padding-left: 20px; }
        #jql-err a { color: inherit; font-weight: 600; }
    `;

    const PAGE_BODY = `
        <div id="jql-lite">
            <h1>JQL search</h1>
            <div class="box">
                <textarea id="jql" rows="3" spellcheck="false" autocomplete="off" autocapitalize="off" autofocus></textarea>
                <div id="jql-dd" hidden></div>
            </div>
            <div class="row">
                <button id="jql-go" type="button">Search</button>
                <span class="hint">Enter — search · Shift+Enter — new line · Ctrl/Cmd+Enter — open in new tab · Tab — accept suggestion</span>
            </div>
            <div id="jql-err" hidden></div>
        </div>
    `;

    // type labels for fields without a bracketed clause name (`Name[Type]`)
    const TYPE_LABELS = {
        status: 'Status', priority: 'Priority', user: 'User', project: 'Project', issuetype: 'Work type',
        date: 'Date', datetime: 'Date time', number: 'Number', string: 'Text', option: 'Dropdown', array: 'List',
        resolution: 'Resolution', version: 'Version', component: 'Component', securitylevel: 'Security level',
        team: 'Team', 'sd-customerrequesttype': 'Request type'
    };

    // autocomplete data, filled by loadData()
    let fieldMap = new Map();
    let fieldItems = [];
    let orderItems = [];
    let functionItems = [];
    // set by bindUi() so late-arriving data can refresh an open dropdown
    let refresh = () => {};

    function initPage() {
        window.stop();
        buildUi();
        // the original 404 page's parser may still add nodes and wipe ours; rebuild if so
        document.addEventListener('DOMContentLoaded', () => {
            if (!document.getElementById('jql-lite')) buildUi();
            const ta = document.getElementById('jql');
            if (ta && document.activeElement !== ta) ta.focus();
        });
        loadData();
    }

    function buildUi() {
        let root = document.documentElement;
        if (!root) root = document.appendChild(document.createElement('html'));
        root.innerHTML = '<head><meta charset="utf-8"><title>JQL search</title><style>' + PAGE_CSS +
            '</style></head><body>' + PAGE_BODY + '</body>';
        bindUi();
    }

    // --- data -----------------------------------------------------------

    function unquote(s) {
        return String(s).replace(/^(["'])([\s\S]*)\1$/, '$2');
    }

    function stripCf(displayName) {
        return String(displayName || '').replace(/ - cf\[\d+\]$/, '');
    }

    // API display names contain markup like <b>Ready</b>; we only ever show plain text
    function stripTags(s) {
        return String(s || '').replace(/<[^>]*>/g, '')
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    }

    function makeItem(value, desc) {
        const d = desc || '';
        return { value, desc: d, keys: [unquote(value).toLowerCase(), stripCf(d).toLowerCase()] };
    }

    function readCache() {
        try {
            const c = JSON.parse(localStorage.getItem(CACHE_KEY));
            if (c && c.ac && c.ts) return c;
        } catch (e) { /* ignore */ }
        return null;
    }

    function writeCache(ac, fields) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ac, fields }));
        } catch (e) { /* quota or disabled storage */ }
    }

    // keep only what the suggestions need from /rest/api/3/field
    function trimFields(all) {
        return all.filter(f => f && f.searchable !== false && Array.isArray(f.clauseNames) && f.clauseNames.length)
            .map(f => {
                const schema = f.schema || {};
                return {
                    name: f.name || '',
                    clauseNames: f.clauseNames,
                    schemaType: schema.type || '',
                    custom: schema.custom || schema.system || ''
                };
            });
    }

    const SIMPLE_NAME_RE = /^[A-Za-z_][\w.]*$/;
    const BRACKET_RE = /^(.*)\[([^\]]+)\]$/;
    const CF_RE = /^cf\[\d+\]$/i;

    function quoteTerm(s) {
        return SIMPLE_NAME_RE.test(s) ? s : '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
    }

    // field suggestion item: `value` is the inserted text, `label` and `type` are what is shown
    function makeFieldItem(value, label, type, ac) {
        return {
            value, label, type, ac, field: true,
            keys: [label.toLowerCase(), unquote(value).toLowerCase()],
            orderable: ac.orderable === 'true'
        };
    }

    // `ac` is the autocompletedata response, `allFields` the trimmed /field list (null when unavailable)
    function setData(ac, allFields) {
        const acFields = ac.visibleFieldNames || [];
        const fields = allFields || [];
        // autocompletedata entries by lowercase unquoted value and by cfid
        const byValue = new Map();
        const byCfid = new Map();
        acFields.forEach(f => {
            const k = unquote(f.value).toLowerCase();
            if (!byValue.has(k)) byValue.set(k, f);
            if (f.cfid && !byCfid.has(f.cfid.toLowerCase())) byCfid.set(f.cfid.toLowerCase(), f);
        });
        const findAc = names => {
            for (const n of names) {
                const k = unquote(n).toLowerCase();
                const f = byValue.get(k) || byCfid.get(k);
                if (f) return f;
            }
            return null;
        };

        // /field fields that are JQL-visible, i.e. have an autocompletedata entry
        const claimed = new Set();
        const vis = [];
        fields.forEach(f => {
            // cf[NNN] first: a plain name may match some other field's entry
            const names = f.clauseNames.filter(c => CF_RE.test(c)).concat(f.clauseNames.filter(c => !CF_RE.test(c)));
            const fac = findAc(names);
            if (!fac) return;
            claimed.add(fac);
            const lname = f.name.toLowerCase();
            let bracket = '';
            let type = '';
            f.clauseNames.some(c => {
                const m = BRACKET_RE.exec(c);
                if (!m || m[1].toLowerCase() !== lname) return false;
                bracket = c;
                type = m[2];
                return true;
            });
            if (!type) type = TYPE_LABELS[f.schemaType] || (f.schemaType ? f.schemaType[0].toUpperCase() + f.schemaType.slice(1) : '');
            vis.push({ f, ac: fac, bracket, type, cf: f.clauseNames.find(c => CF_RE.test(c)) || '', term: '' });
        });

        // a name shared by several fields (or with a JQL-only clause) needs the typed `Name[Type]` form
        const nameCount = new Map();
        vis.forEach(v => {
            const k = v.f.name.toLowerCase();
            nameCount.set(k, (nameCount.get(k) || 0) + 1);
        });
        const jqlOnly = new Set(acFields.filter(f => !claimed.has(f)).map(f => unquote(f.value).toLowerCase()));
        vis.forEach(v => {
            const lname = v.f.name.toLowerCase();
            if (nameCount.get(lname) === 1 && !jqlOnly.has(lname)) {
                const first = v.f.clauseNames[0];
                // system fields insert their JQL name (status, project, created), custom ones the display name
                v.term = !v.cf && SIMPLE_NAME_RE.test(first) ? first : quoteTerm(v.f.name);
            } else {
                v.term = v.bracket ? quoteTerm(v.bracket) : (v.cf || quoteTerm(v.f.clauseNames[0]));
            }
        });
        // one term must not stand for different types: fall back to cf[NNN]
        const termTypes = new Map();
        vis.forEach(v => {
            const k = v.term.toLowerCase();
            if (!termTypes.has(k)) termTypes.set(k, new Set());
            termTypes.get(k).add(v.type);
        });
        vis.forEach(v => {
            if (termTypes.get(v.term.toLowerCase()).size > 1 && v.cf) v.term = v.cf;
        });

        // fields sharing an insert term (e.g. two "Team[Dropdown]" custom fields) become one item
        const groups = new Map();
        vis.forEach(v => {
            const k = v.term.toLowerCase();
            const g = groups.get(k);
            if (!g) groups.set(k, makeFieldItem(v.term, v.f.name, v.type, v.ac));
            else if (v.ac.orderable === 'true') g.orderable = true;
        });
        const items = Array.from(groups.values());

        // JQL-only clauses (issue, text, parent, ...); without /field data custom fields stay as cf[NNN]
        acFields.forEach(f => {
            if (claimed.has(f)) return;
            const raw = unquote(f.value);
            const isCf = CF_RE.test(raw);
            if (isCf && fields.length) return;
            items.push(makeFieldItem(f.value, isCf ? stripCf(f.displayName) || raw : raw, isCf ? raw : '', f));
        });
        items.sort((x, y) => x.label.toLowerCase().localeCompare(y.label.toLowerCase()));
        fieldItems = items;
        orderItems = items.filter(it => it.orderable);

        fieldMap = new Map();
        // exact field values win over clause names / display names / cf ids on clashes
        const add = (key, f) => {
            key = key.toLowerCase();
            if (!fieldMap.has(key)) fieldMap.set(key, f);
        };
        acFields.forEach(f => add(unquote(f.value), f));
        vis.forEach(v => v.f.clauseNames.forEach(c => add(unquote(c), v.ac)));
        acFields.forEach(f => add(stripCf(f.displayName), f));
        acFields.forEach(f => { if (f.cfid) add(f.cfid, f); });
        functionItems = (ac.visibleFunctionNames || []).map(f =>
            Object.assign(makeItem(f.value, f.displayName), { types: f.types || [] }));
    }

    function loadData() {
        try { localStorage.removeItem(OLD_CACHE_KEY); } catch (e) { /* ignore */ }
        const cached = readCache();
        if (cached) setData(cached.ac, cached.fields);
        if (cached && Date.now() - cached.ts < CACHE_TTL) return;
        const getJson = url => fetch(url).then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))));
        Promise.all([
            getJson('/rest/api/3/jql/autocompletedata'),
            // /field is optional: without it only the autocompletedata names are offered
            getJson('/rest/api/3/field').then(trimFields).catch(() => null)
        ])
            .then(([ac, fields]) => {
                setData(ac, fields);
                // a degraded result is not cached, so the next load retries /field
                if (fields) writeCache(ac, fields);
                refresh();
            })
            .catch(() => { /* autocomplete just stays limited */ });
    }

    // --- tokenizer ------------------------------------------------------

    const OPERATORS = ['!=', '!~', '>=', '<=', '=', '~', '>', '<'];
    const NO_CALL = new Set(['and', 'or', 'not', 'in', 'is', 'was']);

    // index just past the `)` matching the `(` at i (or end of text when unterminated)
    function skipCall(text, i) {
        let depth = 0;
        let quote = '';
        for (; i < text.length; i++) {
            const c = text[i];
            if (quote) {
                if (c === '\\') i++;
                else if (c === quote) quote = '';
            } else if (c === '"' || c === "'") {
                quote = c;
            } else if (c === '(') {
                depth++;
            } else if (c === ')' && --depth === 0) {
                return i + 1;
            }
        }
        return text.length;
    }

    function tokenize(text) {
        const tokens = [];
        const n = text.length;
        let i = 0;
        while (i < n) {
            const c = text[i];
            if (/\s/.test(c)) {
                i++;
                continue;
            }
            const start = i;
            let type;
            let partial = false;
            let op;
            if (c === '"' || c === "'") {
                type = 'string';
                i++;
                while (i < n && text[i] !== c) {
                    if (text[i] === '\\') i++;
                    i++;
                }
                partial = i >= n;
                i = Math.min(i + 1, n);
            } else if (c === '(' || c === ')' || c === ',') {
                type = 'punct';
                i++;
            } else if ((op = OPERATORS.find(o => text.startsWith(o, i)))) {
                type = 'op';
                i += op.length;
            } else if (c === '!') {
                type = 'op';
                i++;
            } else {
                type = 'word';
                while (i < n && !/[\s"'(),=!~<>]/.test(text[i])) i++;
                // function call such as currentUser() or membersOf("x"): absorb the arguments into the word
                if (text[i] === '(' && !NO_CALL.has(text.slice(start, i).toLowerCase())) {
                    i = skipCall(text, i);
                }
            }
            tokens.push({ type, text: text.slice(start, i), start, end: i, partial });
        }
        return tokens;
    }

    // --- context state machine -----------------------------------------

    const HISTORY_PREDICATES = new Set(['from', 'to', 'by', 'after', 'before', 'on', 'during']);

    // advance the state machine by one completed token
    function step(ctx, t) {
        const w = t.type === 'word' ? t.text.toLowerCase() : '';
        const isOp = t.type === 'op';
        switch (ctx.state) {
            case 'field':
                if (t.text === '(') ctx.stack.push('group');
                else if (w === 'not') break;
                else if (w === 'order') ctx.state = 'orderBy';
                else if (t.type === 'word' || t.type === 'string') {
                    ctx.fieldName = unquote(t.text);
                    ctx.field = fieldMap.get(ctx.fieldName.toLowerCase()) || null;
                    ctx.op = '';
                    ctx.history = false;
                    ctx.state = 'operator';
                }
                break;
            case 'operator':
                if (w === 'is') {
                    ctx.op = 'is';
                    ctx.state = 'isTarget';
                } else if (w === 'was') {
                    ctx.op = 'was';
                    ctx.history = true;
                    ctx.state = 'wasNext';
                } else if (w === 'not') {
                    ctx.state = 'notNext';
                } else if (w === 'in') {
                    ctx.op = 'in';
                    ctx.state = 'listOpen';
                } else if (w === 'changed') {
                    ctx.op = 'changed';
                    ctx.history = true;
                    ctx.state = 'afterValue';
                } else if (isOp) {
                    ctx.op = t.text;
                    ctx.state = 'value';
                } else {
                    ctx.state = 'afterValue';
                }
                break;
            case 'isTarget':
                if (w === 'not') ctx.op = 'is not';
                else ctx.state = 'afterValue';
                break;
            case 'notNext':
                if (w === 'in') {
                    ctx.op = 'not in';
                    ctx.state = 'listOpen';
                } else {
                    ctx.state = 'afterValue';
                }
                break;
            case 'wasNext':
                if (w === 'not') ctx.state = 'wasNotNext';
                else if (w === 'in') {
                    ctx.op = 'was in';
                    ctx.state = 'listOpen';
                } else ctx.state = isOp ? 'value' : 'afterValue';
                break;
            case 'wasNotNext':
                if (w === 'in') {
                    ctx.op = 'was not in';
                    ctx.state = 'listOpen';
                } else ctx.state = isOp ? 'value' : 'afterValue';
                break;
            case 'listOpen':
                if (t.text === '(') {
                    ctx.stack.push('list');
                    ctx.state = 'listValue';
                } else {
                    ctx.state = 'afterValue';
                }
                break;
            case 'value':
                if (!isOp && t.text !== '(') ctx.state = 'afterValue';
                break;
            case 'listValue':
                if (t.text === ')') {
                    ctx.stack.pop();
                    ctx.state = 'afterValue';
                } else if (t.text !== ',') {
                    ctx.state = 'listAfter';
                }
                break;
            case 'listAfter':
                if (t.text === ',') ctx.state = 'listValue';
                else if (t.text === ')') {
                    ctx.stack.pop();
                    ctx.state = 'afterValue';
                }
                break;
            case 'afterValue':
                if (w === 'and' || w === 'or') {
                    ctx.history = false;
                    ctx.state = 'field';
                } else if (w === 'order') ctx.state = 'orderBy';
                else if (t.text === ')') ctx.stack.pop();
                else if (ctx.history && HISTORY_PREDICATES.has(w)) ctx.state = 'value';
                break;
            case 'orderBy':
                if (w === 'by') ctx.state = 'orderField';
                break;
            case 'orderField':
                if (t.type === 'word' || t.type === 'string') ctx.state = 'orderDir';
                break;
            case 'orderDir':
                if (w === 'asc' || w === 'desc') ctx.state = 'orderAfter';
                else if (t.text === ',') ctx.state = 'orderField';
                break;
            case 'orderAfter':
                if (t.text === ',') ctx.state = 'orderField';
                break;
        }
    }

    // work out what is being typed at the caret
    function analyze(text, caret) {
        const tokens = tokenize(text.slice(0, caret));
        let partial = null;
        const last = tokens[tokens.length - 1];
        // only a token touching the caret is "being typed"; `)`, `,` and closed strings are complete
        if (last && last.end === caret && (last.type === 'word' || last.type === 'op' || last.partial)) {
            partial = tokens.pop();
        }
        const ctx = { state: 'field', field: null, fieldName: '', op: '', history: false, stack: [], partial, start: partial ? partial.start : caret };
        tokens.forEach(t => step(ctx, t));
        return ctx;
    }

    // --- suggestions ----------------------------------------------------

    const GENERIC_OPERATORS = ['=', '!=', '~', '!~', 'in', 'not in', 'is', 'is not', '>', '>=', '<', '<='];

    function keywords(...words) {
        return words.map(w => makeItem(w, ''));
    }

    // exact matches first, then prefix, word-start and substring matches (keys are lowercase)
    function filterItems(list, prefix) {
        if (!prefix) return list;
        const tiers = [[], [], [], []];
        list.forEach(it => {
            if (it.keys.some(k => k === prefix)) tiers[0].push(it);
            else if (it.keys.some(k => k.startsWith(prefix))) tiers[1].push(it);
            else if (it.keys.some(k => k.split(/[^\p{L}\p{N}]+/u).some(w => w.startsWith(prefix)))) tiers[2].push(it);
            else if (it.keys.some(k => k.includes(prefix))) tiers[3].push(it);
        });
        // shorter names first among exact/prefix matches: `cr` → Created before "CRE-API changes"
        const len = it => (it.label || it.keys[0]).length;
        tiers[0].sort((a, b) => len(a) - len(b));
        tiers[1].sort((a, b) => len(a) - len(b));
        return tiers[0].concat(tiers[1], tiers[2], tiers[3]);
    }

    // what the user has typed of the current token, without a leading quote
    function typedPrefix(ctx) {
        return ctx.partial ? ctx.partial.text.replace(/^["']/, '') : '';
    }

    // returns the locally known items and, for value positions, a remote lookup to merge in
    function suggest(ctx) {
        // a half-typed symbolic operator (e.g. `=`) is not worth suggesting for
        if (ctx.partial && ctx.partial.type === 'op') return { items: [], remote: null };
        const prefix = typedPrefix(ctx).toLowerCase();
        const field = ctx.field;
        let list = [];
        let remote = null;
        switch (ctx.state) {
            case 'field':
                list = fieldItems.concat(keywords('NOT'));
                break;
            case 'operator':
                list = (field && field.operators ? field.operators : GENERIC_OPERATORS).map(o => makeItem(o, ''));
                break;
            case 'isTarget':
                list = (ctx.op === 'is' ? keywords('not') : []).concat(keywords('EMPTY', 'NULL'));
                break;
            case 'notNext':
            case 'wasNotNext':
                list = keywords('in');
                break;
            case 'wasNext':
                list = keywords('not', 'in');
                break;
            case 'listOpen':
                list = keywords('(');
                break;
            case 'value':
            case 'listValue':
                // send what the user typed: the suggestions API also resolves aliases like "Team[Dropdown]"
                if (field ? field.auto === 'true' : !!ctx.fieldName) {
                    remote = { field: ctx.fieldName || unquote(field.value), prefix: typedPrefix(ctx) };
                }
                if (field && field.types) list = functionItems.filter(f => f.types.some(t => field.types.includes(t)));
                break;
            case 'listAfter':
                list = keywords(',', ')');
                break;
            case 'afterValue':
                list = keywords('AND', 'OR', 'ORDER BY');
                if (ctx.history) list = list.concat(keywords('FROM', 'TO', 'BY', 'AFTER', 'BEFORE', 'ON', 'DURING'));
                if (ctx.stack.includes('group')) list = list.concat(keywords(')'));
                break;
            case 'orderBy':
                list = keywords('BY');
                break;
            case 'orderField':
                list = orderItems;
                break;
            case 'orderDir':
                list = keywords('ASC', 'DESC');
                break;
        }
        return { items: filterItems(list, prefix), remote };
    }

    // --- UI -------------------------------------------------------------

    function bindUi() {
        const ta = document.getElementById('jql');
        const dd = document.getElementById('jql-dd');
        const goBtn = document.getElementById('jql-go');
        const errBox = document.getElementById('jql-err');

        let view = { items: [], sel: 0, start: 0 };
        let timer = 0;
        let abortCtl = null;
        let busy = false;

        // --- textarea basics

        function grow() {
            ta.style.height = 'auto';
            ta.style.height = ta.scrollHeight + 2 + 'px';
        }

        ta.value = new URLSearchParams(location.search).get('jql') || '';
        grow();
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);

        // --- dropdown

        function hide() {
            dd.hidden = true;
            view.items = [];
        }

        function setSel(i) {
            view.sel = i;
            Array.from(dd.children).forEach((el, k) => el.classList.toggle('sel', k === i));
            if (dd.children[i]) dd.children[i].scrollIntoView({ block: 'nearest' });
        }

        // put the dropdown under the character at `pos`, measured with a hidden mirror of the textarea
        function place(pos) {
            const cs = getComputedStyle(ta);
            const mirror = document.createElement('div');
            const m = mirror.style;
            ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'wordSpacing', 'textTransform', 'tabSize',
                'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'boxSizing'
            ].forEach(p => { m[p] = cs[p]; });
            m.borderStyle = 'solid';
            m.position = 'absolute';
            m.visibility = 'hidden';
            m.top = '0';
            m.left = '-9999px';
            m.width = ta.offsetWidth + 'px';
            m.whiteSpace = 'pre-wrap';
            m.wordWrap = 'break-word';
            m.overflow = 'hidden';
            mirror.appendChild(document.createTextNode(ta.value.slice(0, pos)));
            const marker = document.createElement('span');
            marker.style.display = 'inline-block';
            marker.textContent = '​';
            mirror.appendChild(marker);
            mirror.appendChild(document.createTextNode(ta.value.slice(pos)));
            document.body.appendChild(mirror);
            const lineHeight = parseFloat(cs.lineHeight) || marker.offsetHeight;
            const x = marker.offsetLeft;
            const y = marker.offsetTop;
            mirror.remove();
            const box = ta.offsetParent || ta.parentNode;
            let left = ta.offsetLeft + parseFloat(cs.borderLeftWidth) + x - ta.scrollLeft;
            // keep the dropdown inside the box
            left = Math.max(0, Math.min(left, box.clientWidth - dd.offsetWidth));
            dd.style.left = left + 'px';
            dd.style.top = ta.offsetTop + parseFloat(cs.borderTopWidth) + y - ta.scrollTop + lineHeight + 4 + 'px';
        }

        function show(items, ctx) {
            const typed = ctx.partial ? ctx.partial.text.toLowerCase() : '';
            items = items.slice(0, MAX_ITEMS);
            view = { items, sel: 0, start: ctx.start };
            dd.textContent = '';
            if (!items.length) {
                dd.hidden = true;
                return;
            }
            const prefix = typedPrefix(ctx).toLowerCase();
            items.forEach((it, i) => {
                const row = document.createElement('div');
                row.className = 'item';
                row.dataset.index = String(i);
                const name = document.createElement('div');
                name.className = 'name';
                let sub = '';
                if (it.field) {
                    // matched part of the name in bold
                    const at = prefix ? it.label.toLowerCase().indexOf(prefix) : -1;
                    if (at < 0) {
                        name.textContent = it.label;
                    } else {
                        const b = document.createElement('b');
                        b.textContent = it.label.slice(at, at + prefix.length);
                        name.appendChild(document.createTextNode(it.label.slice(0, at)));
                        name.appendChild(b);
                        name.appendChild(document.createTextNode(it.label.slice(at + prefix.length)));
                    }
                    sub = it.type;
                } else {
                    name.textContent = it.value;
                    if (it.desc && it.desc !== unquote(it.value)) sub = it.desc;
                }
                row.appendChild(name);
                if (sub) {
                    const subEl = document.createElement('div');
                    subEl.className = 'sub';
                    subEl.textContent = sub;
                    row.appendChild(subEl);
                }
                dd.appendChild(row);
            });
            dd.hidden = false;
            place(ctx.start);
            // nothing is pre-selected after a finished value, or when a value/keyword is already typed
            // in full, so Enter still submits (Tab or arrows pick a suggestion)
            const top = items[0];
            const exact = top && (top.value.toLowerCase() === typed || (top.label || '').toLowerCase() === typed);
            const fieldPos = ctx.state === 'field' || ctx.state === 'orderField';
            setSel((ctx.state === 'afterValue' && !ctx.partial) || (exact && !fieldPos) ? -1 : 0);
        }

        function accept(index) {
            const it = view.items[index];
            if (!it) return;
            const text = ta.value;
            const caret = ta.selectionStart;
            const start = view.start;
            let ins = it.value + ' ';
            // keep tokens apart when inserting right after a non-space character
            if (start === caret && start > 0 && !/[\s(]/.test(text[start - 1]) && it.value !== ',' && it.value !== ')') {
                ins = ' ' + ins;
            }
            ta.value = text.slice(0, start) + ins + text.slice(caret);
            const pos = start + ins.length;
            ta.setSelectionRange(pos, pos);
            grow();
            hide();
            update();
        }

        function update() {
            clearTimeout(timer);
            if (abortCtl) abortCtl.abort();
            abortCtl = null;
            const ctx = analyze(ta.value, ta.selectionStart);
            const res = suggest(ctx);
            show(res.items, ctx);
            if (!res.remote) return;
            timer = setTimeout(() => {
                const ctl = new AbortController();
                abortCtl = ctl;
                const url = '/rest/api/3/jql/autocompletedata/suggestions?fieldName=' + encodeURIComponent(res.remote.field) +
                    '&fieldValue=' + encodeURIComponent(res.remote.prefix);
                fetch(url, { signal: ctl.signal })
                    .then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
                    .then(data => {
                        if (abortCtl !== ctl) return;
                        const values = (data.results || []).map(r => makeItem(r.value, stripTags(r.displayName)));
                        show(values.concat(res.items), ctx);
                    })
                    .catch(() => { /* aborted or failed: keep what is shown */ });
            }, SUGGEST_DELAY);
        }

        refresh = () => {
            if (document.activeElement === ta) update();
        };

        dd.addEventListener('mousedown', e => {
            const row = e.target.closest('.item');
            if (!row) return;
            e.preventDefault(); // keep focus in the textarea
            accept(Number(row.dataset.index));
        });

        ta.addEventListener('input', () => {
            grow();
            update();
        });
        ta.addEventListener('click', update);
        ta.addEventListener('keyup', e => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) update();
        });
        ta.addEventListener('blur', () => setTimeout(hide, 150));

        ta.addEventListener('keydown', e => {
            if (e.isComposing) return;
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                submit(true);
                return;
            }
            const n = view.items.length;
            if (!dd.hidden && n) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSel((view.sel + 1) % n);
                    return;
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSel(view.sel <= 0 ? n - 1 : view.sel - 1);
                    return;
                }
                if (e.key === 'Tab' && !e.shiftKey) {
                    e.preventDefault();
                    accept(Math.max(view.sel, 0));
                    return;
                }
                if (e.key === 'Enter' && !e.shiftKey && view.sel >= 0) {
                    e.preventDefault();
                    accept(view.sel);
                    return;
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    hide();
                    return;
                }
            }
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(false);
            }
        });

        // --- submit

        function go(jql, newTab) {
            const url = '/issues?jql=' + encodeURIComponent(jql);
            // so Back (or a reload) restores the query on this page
            history.replaceState(null, '', PAGE_PATH + '?jql=' + encodeURIComponent(jql));
            if (newTab) window.open(url, '_blank');
            else location.href = url;
        }

        function showErrors(errors, jql, newTab) {
            errBox.textContent = '';
            const ul = document.createElement('ul');
            errors.forEach(err => {
                const li = document.createElement('li');
                li.textContent = typeof err === 'string' ? err : err.message || JSON.stringify(err);
                ul.appendChild(li);
            });
            const link = document.createElement('a');
            link.href = '/issues?jql=' + encodeURIComponent(jql);
            link.textContent = 'Search anyway';
            link.addEventListener('click', e => {
                e.preventDefault();
                go(jql, newTab || e.ctrlKey || e.metaKey);
            });
            errBox.appendChild(ul);
            errBox.appendChild(link);
            errBox.hidden = false;
        }

        async function submit(newTab) {
            if (busy) return;
            hide();
            errBox.hidden = true;
            const jql = ta.value.trim();
            if (!jql) {
                go(jql, newTab);
                return;
            }
            busy = true;
            goBtn.disabled = true;
            goBtn.textContent = 'Checking…';
            let errors = [];
            try {
                const r = await fetch('/rest/api/3/jql/parse?validation=strict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Atlassian-Token': 'no-check' },
                    body: JSON.stringify({ queries: [jql] })
                });
                if (r.ok) {
                    const data = await r.json();
                    errors = (data.queries && data.queries[0] && data.queries[0].errors) || [];
                }
            } catch (e) { /* validation is best effort: fall through and just search */ }
            busy = false;
            goBtn.disabled = false;
            goBtn.textContent = 'Search';
            if (errors.length) showErrors(errors, jql, newTab);
            else go(jql, newTab);
        }

        goBtn.addEventListener('click', e => submit(e.ctrlKey || e.metaKey));
    }

    // dispatch last: the consts/lets above must be initialized before any mode runs
    if (location.pathname.startsWith(PAGE_PATH)) {
        initPage();
    } else if (!location.pathname.startsWith('/wiki')) {
        initNavButton();
    }
})();
