// ==UserScript==
// @name         JIRA airtable opener
// @namespace    http://tampermonkey.net/
// @version      1
// @description  enables to open airtable record
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    const FAKE_ID = 'custom_air_button';

    waitForKeyElements (
        '<div class="sc-1njt3iw-0 klZhqF">',
        appendAirtableButton
    );

    async function appendAirtableButton() {
        const customButton = document.getElementById(FAKE_ID);
        if (customButton != null) {
            return;
        }
        let statusButton = document.querySelector('[data-test-id="issue.views.issue-base.foundation.status.status-field-wrapper"]');
        if (statusButton != null) {
            let airTableDiv = document.createElement('div');
            airTableDiv.setAttribute('id', FAKE_ID); // insert unique div to prevent duplicated execution
            airTableDiv.setAttribute('class', '_u5f3n7od _n3tdftgi');
            statusButton.parentNode.appendChild(airTableDiv);

            // look for airtable ID
            let uniqueProjectCode = '';
            let uniqueProjectCodeElement = document.querySelector('[data-test-id="issue.views.field.single-line-text-inline-edit.read-view.customfield_14548"]');
            if (uniqueProjectCodeElement != null) {
                uniqueProjectCode = uniqueProjectCodeElement.textContent;
            }

            // if found add reference
            if (uniqueProjectCode != '') {
                let airTableButton = document.createElement('div');
                airTableButton.setAttribute('class', 'css-3uc9ov ewxv9o42 css-7uss0q');
                airTableButton.setAttribute('type', 'button');
                airTableButton.setAttribute('onclick', 'window.open(\'https://airtable.com/appvIpUKeCZPt2kAq/tbllPW0bNpMusk8Ss/viwDIHGD8fwIU2FS4/' + uniqueProjectCode + '?blocks=hide\')');
                airTableButton.innerHTML += 'Airtable <svg width="16" height="16" viewBox="0 0 13 13" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" xmlns="http://www.w3.org/2000/svg"><path d="M5.99751 5L10.4975 5C10.7737 5 10.9975 5.22386 10.9975 5.5L10.9975 10C10.9975 10.2761 10.7737 10.5 10.4975 10.5C10.2214 10.5 9.99751 10.2761 9.99751 10L9.99751 6.70711L4.48711 12.2175L3.78 11.5104L9.29041 6L5.99751 6C5.72137 6 5.49751 5.77614 5.49751 5.5C5.49751 5.22386 5.72137 5 5.99751 5Z"></path></svg>';
                airTableDiv.appendChild(airTableButton);
            }
        }
    }
})();