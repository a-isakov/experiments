// ==UserScript==
// @name         JIRA epic status
// @namespace    http://tampermonkey.net/
// @version      1
// @description  show and change epic status
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
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
    GM_registerMenuCommand('Close Epic', closeEpicFromMenu, 'C');

    async function appendButtons() {
        const customButton = document.getElementById('custom_status_label');
        if (customButton != null) {
            return;
        }
        const label = findByText('h2', 'Child issues')
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
                    // console.log(jiraIssue);
                    const status = jiraIssue['fields']['customfield_10105']['value'];
                    const type = jiraIssue['fields']['issuetype']['id'];
                    if (type == TYPE_EPIC && status != 'Done') {
                        let epicStatusButton = document.createElement('div');
                        epicStatusButton.innerHTML = '<button id="custom_status_label" aria-label="Close" aria-expanded="false" class="css-1xewsy6" type="button" tabindex="0">Close</button>';
                        epicStatusButton.addEventListener('click', function() {
                            customButtonListener(jiraKey)
                        }, false);
                        epicStatusElement.appendChild(epicStatusButton);
                    }
                }
            }
        }
    }

    function closeEpicFromMenu() {
        const url = document.URL.split('/');
        let jiraKey = url[url.length - 1];
        customButtonListener(jiraKey);
    }

    function customButtonListener(jiraKey) {
        if (confirm('Are you sure you want to close the Epic ' + jiraKey + '?')) {
            Promise.all([
                closeEpic(jiraKey)
            ]).then(() => {
                console.log('done');
                window.location.reload();
            })
        }
    }
    
    async function closeEpic(jiraKey) {
        const data = '{"issueIdOrKey":"' + jiraKey + '","fieldId":"customfield_10105","newValue":10102}';
        const URL = '/rest/greenhopper/1.0/xboard/issue/update-field.json';
        console.log('This will close ' + jiraKey);
        // do the status change
        const moveResponse = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });
        // console.log(moveResponse);
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