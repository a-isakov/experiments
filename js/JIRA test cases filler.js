// ==UserScript==
// @name         JIRA test cases filler
// @namespace    http://tampermonkey.net/
// @version      1
// @description  fill N/A for test cases when possible
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
        '<select class="select" id="resolution" name="resolution">',
        fixTestCasesField
    );

    async function fixTestCasesField() {
        const resolutionSelect = document.getElementById('resolution');
        if (resolutionSelect != null) {
            const resolution = resolutionSelect.options[resolutionSelect.selectedIndex].text;
            if (resolution != 'Done') {
                let testCasesField = document.getElementById('customfield_14677');
                if (testCasesField.value == '') {
                    testCasesField.value = 'N/A';
                }
            } else {
                let testCasesField = document.getElementById('customfield_14677');
                if (testCasesField.value == 'N/A') {
                    testCasesField.value = '';
                }
            }
        }
    }
})();