// ==UserScript==
// @name         JIRA epic status
// @namespace    http://tampermonkey.net/
// @version      1
// @description  show and change epic status
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    const TYPE_EPIC = 6;

    waitForKeyElements (
        '<div class="sc-1njt3iw-0 klZhqF">',
        appendButtons
    );

    async function appendButtons() {
        const customButton = document.getElementById('custom_status_label');
        if (customButton != null) {
            return;
        }
        const label = findByText('h2', 'Issues in this epic')
        if (label != null) {
            let statusButtons = document.querySelector("[data-test-id='issue.views.issue-base.context.status-and-approvals-wrapper.status-and-approval']")
            if (statusButtons != null) {
                let epicStatusElement = document.createElement('div');
                epicStatusElement.innerHTML = '<span id="custom_status_label" class="sc-1tohg2d-1 diRGjn"/>';
                statusButtons.appendChild(epicStatusElement);
                const url = document.URL.split('/');
                let jiraKey = url[url.length - 1];
                const response = await fetch('/rest/api/2/issue/' + jiraKey + '?fields=issuetype,customfield_10105'); // retrieve issue details to close
                if (response.status == 200) {
                    const jiraIssue = await response.json();
                    const status = jiraIssue['fields']['customfield_10105']['value'];
                    const type = jiraIssue['fields']['issuetype']['id'];
                    if (type == TYPE_EPIC && status != 'Done') {
                        let epicStatusButton = document.createElement('div');
                        epicStatusButton.innerHTML = '<button id="custom_status_label" aria-label="Close" aria-expanded="false" class="elro8wh1 css-m11wyc" type="button" tabindex="0">Close</button>';
                        epicStatusButton.addEventListener('click', function() {
                            customButtonListener(jiraKey)
                        }, false);
                        epicStatusElement.appendChild(epicStatusButton);
                    }
                }
            }
        }
    }

    function customButtonListener(jiraKey) {
        console.log('++++++');
        console.log(jiraKey);
    }

    function findByText(tag, text) {
        const aTags = document.getElementsByTagName(tag);
        for (let i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == text) {
                return aTags[i];
            }
        }
        return null
    }
})();