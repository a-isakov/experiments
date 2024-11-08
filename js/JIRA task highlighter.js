// ==UserScript==
// @name         JIRA task highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes unnecessary parts
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements (
        '<div class="css-k9aspw">',
        removeSparkConversationMessage
    );

    async function removeSparkConversationMessage() {
        let messageBlocks = document.getElementsByClassName('css-k9aspw');
        for (let j = 0; j < messageBlocks.length; j++) {
            let messageBlock = messageBlocks[j];
            let parent = messageBlock.parentNode;
            parent.removeChild(messageBlock);
            break;
        }
    }

})();