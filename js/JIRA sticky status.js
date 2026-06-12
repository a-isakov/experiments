// ==UserScript==
// @name         JIRA sticky status
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  keep the status/approval block visible while scrolling by pinning it with position:sticky inside the right column (CSS only, leaves the real button untouched)
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @match        https://tinypass.atlassian.net/jira/software/c/projects*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // The right column scrolls inside `container-right`. The status block's wrapper
    // (visibility-container) is tall (it holds Details/Development/etc. too), so making
    // the block itself sticky keeps it pinned for the whole scroll. Above it in the same
    // column sits the sticky watchers header (~48px), so park the status just below it.
    const TOP_OFFSET = '48px';

    const css = `
        [data-testid="ref-spotlight-target-status-and-approval-spotlight"] {
            position: sticky !important;
            top: ${TOP_OFFSET} !important;
            /* high z-index so a section's own sticky header can't paint over it */
            z-index: 100 !important;
            /* solid opaque background (token first, hard fallbacks) so scrolling
               content does not show through the pinned block */
            background-color: var(--ds-surface, var(--ds-background-default, #fff)) !important;
            box-shadow: 0 2px 4px -2px rgba(9, 30, 66, 0.25) !important;
            padding-bottom: 8px !important;
        }
    `;

    const style = document.createElement('style');
    style.id = 'jira-sticky-status-style';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
})();
