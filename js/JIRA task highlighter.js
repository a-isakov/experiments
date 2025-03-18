// ==UserScript==
// @name         JIRA task highlighter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  removes unnecessary parts
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @match        https://tinypass.atlassian.net/jira/software/c/projects*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements (
        '<div class="css-k9aspw">',
        removeUselessPanels
    );

    async function removeUselessPanels() {
        removeItemsWithClass('css-1k3wdpm'); // removes info block when no comments
        removeItemsWithClass('_19itglyw _vchhusvi _r06hglyw _1q51u2gc _85i5pxbi _bozgu2gc _y4tiu2gc _kqswh2mm'); // removes panel with text "You're in a company-managed project"
    }

    async function removeItemsWithClass(className) {
        let messageBlocks = document.getElementsByClassName(className);
        for (let j = 0; j < messageBlocks.length; j++) {
            let messageBlock = messageBlocks[j];
            let parent = messageBlock.parentNode;
            parent.removeChild(messageBlock);
            break;
        }
    }

})();