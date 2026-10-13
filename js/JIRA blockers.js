// ==UserScript==
// @name         JIRA blockers
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  hide unnecessary elements, mark scope creep issues added after sprint start
// @author       You
// @match        https://tinypass.atlassian.net/jira/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function () {
    'use strict';
    let links = ['is blocked by', 'Successor'];
    let linksReverse = ['is blocking', 'Predecessor'];
    const cache_limit_minutes = 120; // when to refresh the cached record in the background
    const cache_max_age_days = 7;    // when to drop the cached record entirely
    let extraKeysPromise = null;   // Promise<Set<string>>, page-lifetime cache
    let extraKeysBoardId = null;   // reset the cache when the board changes
    let cacheDbPromise = null;     // Promise<IDBDatabase>, page-lifetime cache
    const pendingFetches = new Map(); // key -> in-flight fetchIssueRecord promise

    cleanupExpiredCache();

    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        checkFlag
    );

    async function checkFlag(element) {
        let board = document.querySelector("[data-onboarding-observer-id='board-wrapper']");
        if (board != null)
        {
            const runFlag = board.getAttribute('custom_blockers_run_flag');
            if (runFlag == null || runFlag != 'true') {
                board.setAttribute('custom_blockers_run_flag', 'true');
                mainLoop();
                board.setAttribute('custom_blockers_run_flag', 'false');
            }
        }
    }

    async function mainLoop() {
        let progressBar = null;
        // progress bar doesn't work
        // let ghxOperations = document.querySelector("[data-testid='software-filters.ui.filter-selection-bar.filter-selection-bar']");
        // if (ghxOperations != null) {
        //     progressBar = document.createElement('div'); // create a progress bar
        //     progressBar.innerHTML = '<div class="progress-container" style="height: 0.4rem; width: 12rem;border-radius: 0.2rem; background: #000;"><div class="progress" id="bar_element" style="height: 100%;width: 0;border-radius: 0.2rem;background: #ff4754;transition: width 0.4s ease;"></div></div>'
        //     ghxOperations.appendChild(progressBar);
        // }
        // const changeProgress = (progress) => {
        //     let bar = document.getElementById('bar_element');
        //     if (bar != null) {
        //         bar.style.width = `${progress}%`;
        //     }
        // };
        await new Promise(resolve => setTimeout(resolve, 5000));

        const extraKeys = await getExtraIssueKeys(getBoardId());

        let cardMarkers = document.querySelectorAll('[data-testid="platform-card.ui.card.focus-container"]');
        cardMarkers.forEach(async cardMarker => {
            let cardRoot = cardMarker.parentNode; // card container that holds the whole card
            if (cardRoot == null) {
                return;
            }
            // exactly one key.key lives inside a card subtree; take the issue key from its browse link
            // (index-based traversal breaks now that Jira injects <style data-emotion> nodes as first children)
            let keyContainer = cardRoot.querySelector('[data-testid="platform-card.common.ui.key.key"]');
            if (keyContainer == null) {
                return;
            }
            let keyLink = keyContainer.querySelector('a[href*="/browse/"]');
            if (keyLink == null) {
                return;
            }
            let cardKey = keyLink.getAttribute('href').split('/browse/')[1].split(/[?#]/)[0]; // task number
            if (!cardKey) {
                return;
            }
            // stable insertion point: the content column that holds the footer (and all content sections)
            let footer = cardRoot.querySelector('[data-testid="platform-card.ui.card.card-content.footer"]');
            let cardContainer = footer != null ? footer.parentNode : cardRoot;
            const blockersProcessed = cardContainer.getAttribute('blockers_processed');
            if (blockersProcessed == null || blockersProcessed != 'true') {
                cardContainer.setAttribute('blockers_processed', 'true');
                processIssueCard(cardContainer, cardKey);
            }
            if (footer != null && extraKeys.has(cardKey)) {
                appendExtraPill(footer);
            }
        });

        // if (progressBar != null) { //delete a progress bar
        //     let navParent = progressBar.parentNode
        //     if (navParent != null) {
        //         navParent.removeChild(progressBar);
        //     }
        // }
    }

    // extract the board id from the url, either /boards/123 or ?rapidView=123
    function getBoardId() {
        let match = location.pathname.match(/\/boards\/(\d+)/);
        if (match != null) {
            return match[1];
        }
        let params = new URLSearchParams(location.search);
        let rapidView = params.get('rapidView');
        if (rapidView != null) {
            return rapidView;
        }
        return null;
    }

    // returns a Set of issue keys added to an active sprint after it started, cached for the page lifetime
    async function getExtraIssueKeys(boardId) {
        if (boardId == null) {
            return new Set();
        }
        if (boardId !== extraKeysBoardId) {
            extraKeysBoardId = boardId;
            extraKeysPromise = null;
        }
        if (extraKeysPromise != null) {
            return extraKeysPromise;
        }
        extraKeysPromise = fetchExtraIssueKeys(boardId);
        return extraKeysPromise;
    }

    // fetches the scope-creep issue keys for a board, empty Set on any failure or non-scrum board
    async function fetchExtraIssueKeys(boardId) {
        let extraKeys = new Set();
        try {
            const boardResponse = await fetch('/rest/agile/1.0/board/' + boardId);
            if (boardResponse.status != 200) {
                return extraKeys;
            }
            const board = await boardResponse.json();
            if (board['type'] != 'scrum') {
                return extraKeys;
            }

            const sprintResponse = await fetch('/rest/agile/1.0/board/' + boardId + '/sprint?state=active');
            if (sprintResponse.status != 200) {
                return extraKeys;
            }
            const sprintJson = await sprintResponse.json();
            const sprints = sprintJson['values'] || [];

            for (let i = 0; i < sprints.length; i++) {
                const sprint = sprints[i];
                const reportResponse = await fetch('/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=' + boardId + '&sprintId=' + sprint['id']);
                if (reportResponse.status != 200) {
                    continue;
                }
                const reportJson = await reportResponse.json();
                const addedKeys = (reportJson['contents'] || {})['issueKeysAddedDuringSprint'] || {};
                for (let key in addedKeys) {
                    extraKeys.add(key);
                }
            }
        } catch (e) {
            return new Set();
        }
        return extraKeys;
    }

    // opens (or reuses) the IndexedDB cache database, never throws
    async function openCacheDb() {
        if (cacheDbPromise != null) {
            return cacheDbPromise;
        }
        cacheDbPromise = new Promise(resolve => {
            try {
                if (typeof indexedDB === 'undefined') {
                    resolve(null);
                    return;
                }
                const request = indexedDB.open('jira_blockers_cache', 1);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains('issues')) {
                        const store = db.createObjectStore('issues', { keyPath: 'key' });
                        store.createIndex('time_created', 'time_created');
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
        return cacheDbPromise;
    }

    // returns the cached record for a key, or null on a miss or any failure
    async function cacheGet(key) {
        try {
            const db = await openCacheDb();
            if (db == null) {
                return null;
            }
            return await new Promise(resolve => {
                try {
                    const tx = db.transaction('issues', 'readonly');
                    const request = tx.objectStore('issues').get(key);
                    request.onsuccess = () => resolve(request.result || null);
                    request.onerror = () => resolve(null);
                } catch (e) {
                    resolve(null);
                }
            });
        } catch (e) {
            return null;
        }
    }

    // stores a record, silently does nothing on failure
    async function cachePut(record) {
        try {
            const db = await openCacheDb();
            if (db == null) {
                return;
            }
            await new Promise(resolve => {
                try {
                    const tx = db.transaction('issues', 'readwrite');
                    tx.objectStore('issues').put(record);
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => resolve();
                } catch (e) {
                    resolve();
                }
            });
        } catch (e) {
            // ignore
        }
    }

    // drops records older than cache_max_age_days, silently does nothing on failure
    async function cleanupExpiredCache() {
        try {
            const db = await openCacheDb();
            if (db == null) {
                return;
            }
            const cutoff = Date.now() - cache_max_age_days * 86400000;
            await new Promise(resolve => {
                try {
                    const tx = db.transaction('issues', 'readwrite');
                    const index = tx.objectStore('issues').index('time_created');
                    const request = index.openCursor(IDBKeyRange.upperBound(cutoff));
                    request.onsuccess = () => {
                        const cursor = request.result;
                        if (cursor != null) {
                            cursor.delete();
                            cursor.continue();
                        }
                    };
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => resolve();
                } catch (e) {
                    resolve();
                }
            });
        } catch (e) {
            // ignore
        }
    }

    // fetches an issue, builds a compact cache record and stores it, null on any failure; dedups in-flight requests
    async function fetchIssueRecord(key) {
        if (pendingFetches.has(key)) {
            return pendingFetches.get(key);
        }
        const promise = (async () => {
            try {
                const response = await fetch('/rest/api/2/issue/' + key + '?fields=issuelinks');
                if (response.status != 200) {
                    return null;
                }
                const jiraIssue = await response.json();
                const issuelinks = jiraIssue['fields']['issuelinks'] || [];
                const recordLinks = [];
                for (let g = 0; g < issuelinks.length; g++) {
                    let issuelink = issuelinks[g];
                    let direction = '';
                    if ('inwardIssue' in issuelink) {   // check rather we have inwardIssue or outwardIssue
                        direction = 'inward';
                    } else if ('outwardIssue' in issuelink) {
                        direction = 'outward';
                    }
                    if (direction == '') {
                        continue;
                    }
                    recordLinks.push({
                        name: issuelink['type'][direction],
                        key: issuelink[direction + 'Issue']['key'],
                        statusCategory: issuelink[direction + 'Issue']['fields']['status']['statusCategory']['key']
                    });
                }
                const record = { key: key, time_created: Date.now(), links: recordLinks };
                await cachePut(record);
                return record;
            } catch (e) {
                return null;
            }
        })();
        pendingFetches.set(key, promise);
        try {
            return await promise;
        } finally {
            pendingFetches.delete(key);
        }
    }

    async function processIssueCard(card, key) {
        let record = await cacheGet(key);
        if (record == null) {
            record = await fetchIssueRecord(key);
            if (record == null) {
                return;
            }
        } else if (Date.now() - record.time_created > cache_limit_minutes * 60000) {
            fetchIssueRecord(key); // refresh the cache in the background, render the stale record now
        }

        for (let g = 0; g < record.links.length; g++) {
            let link = record.links[g];
            for (let z = 0; z < links.length; z++) {
                if (link.name == links[z]) { // choose necessary Linked issues
                    await appendLink(card, link.key, link.statusCategory, true);
                } else if (link.name == linksReverse[z]) {
                    await appendLink(card, link.key, link.statusCategory, false);
                }
            }
        }
    }

    // append blocker to the issue card
    async function appendLink(card, linkedKey, statusCategory, forBlocker) {
        if (card != null && card.parentNode.childElementCount > 0) { // create button
            let element = document.createElement('div');
            if (statusCategory != 'done') {
                element.innerHTML = '<a  href="https://tinypass.atlassian.net/browse/' + linkedKey + '" class="aui-lozenge ghx-label-14" style="font-size:70%" onclick="window.open(\'https://tinypass.atlassian.net/browse/' + linkedKey + '\')" >' + linkedKey + '</a>';
            }
            if (statusCategory == 'done') {
                element.innerHTML = '<a  href="https://tinypass.atlassian.net/browse/' + linkedKey + '" class="aui-lozenge ghx-label-6" style="text-decoration: line-through; font-size:70%" onclick="windiw.open(\'https://tinypass.atlassian.net/browse/' + linkedKey + '\')">' + linkedKey + '</a>';
            }
            let blockersContainer = await getBlockersContainer(card, forBlocker);
            if (blockersContainer != null) {
                blockersContainer.appendChild(element);
            }
        }
    }

    // returns div of the blockers, creates it if need
    async function getBlockersContainer(card, forBlocker) {
        let div = card.querySelector("[id='blockers_container']");
        if (div == null) {
            let element = document.createElement('div');
            element.setAttribute('id', 'blockers_container');
            element.style.setProperty('max-width', 'none');
            element.style.setProperty('display', 'flex');
            element.style.setProperty('justify-content', 'space-between');
            let leftDiv = document.createElement('div');
            leftDiv.setAttribute('id', 'blockers_container_left');
            leftDiv.style.setProperty('max-width', '50%');
            let rightDiv = document.createElement('div');
            rightDiv.setAttribute('id', 'blockers_container_right');
            rightDiv.style.setProperty('max-width', '50%');
            rightDiv.style.setProperty('text-align', 'right');
            element.appendChild(leftDiv);
            element.appendChild(rightDiv);
            card.appendChild(element);
            div = element;
        }
        let blockersContainer = div.querySelector(forBlocker ? "[id='blockers_container_left']" : "[id='blockers_container_right']");
        return blockersContainer;
    }

    // append an "extra" pill to a card added to the active sprint after it started
    function appendExtraPill(footer) {
        if (footer.querySelector('[data-extra-pill]') != null) {
            return;
        }
        let row = footer;
        let priorityIcon = footer.querySelector('[data-testid="platform-card.common.ui.priority.icon"]');
        let estimateWrapper = footer.querySelector('[data-testid="software-board.common.fields.estimate-field.static.estimate-wrapper"]');
        if (priorityIcon != null) {
            row = priorityIcon.parentNode;
        } else if (estimateWrapper != null) {
            row = estimateWrapper.parentNode;
        }
        let pill = document.createElement('span');
        pill.setAttribute('data-extra-pill', 'true');
        pill.textContent = 'extra';
        pill.style.setProperty('font-size', '70%');
        pill.style.setProperty('font-weight', '600');
        pill.style.setProperty('text-transform', 'uppercase');
        pill.style.setProperty('border-radius', '3px');
        pill.style.setProperty('padding', '0 4px');
        pill.style.setProperty('line-height', '1.4');
        pill.style.setProperty('white-space', 'nowrap');
        pill.style.setProperty('background', 'var(--ds-background-accent-orange-subtler, #FFF0B3)');
        pill.style.setProperty('color', 'var(--ds-text-accent-orange-bolder, #7F5F01)');
        row.appendChild(pill);
    }

    // async function getChild(node, level, path) {
    //     // example: let cardContainer = await getChild(card, 4, [1, 0, 0, 0]);
    //     let child = node;
    //     for (let i = 0; i < level; i++) {
    //         const childPosition = path[i];
    //         if (childPosition > child.childNodes.length - 1) {
    //             // check array index
    //             return null;
    //         }
    //         child = child.childNodes[childPosition];
    //         if (child == null) {
    //             break;
    //         }
    //     }
    //     return child;
    // }
})();