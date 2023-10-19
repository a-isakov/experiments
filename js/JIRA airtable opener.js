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
        let statusButton = document.querySelector('[data-testid="issue.views.issue-base.foundation.status.status-field-wrapper"]');
        if (statusButton != null) {
            let airTableDiv = document.createElement('div');
            airTableDiv.setAttribute('id', FAKE_ID); // insert unique div to prevent duplicated execution
            airTableDiv.setAttribute('class', 'sc-1tohg2d-1 diRGjn');
            statusButton.parentNode.appendChild(airTableDiv);

            // look for airtable ID
            let uniqueProjectCode = '';
            let uniqueProjectCodeElement = document.querySelector('[data-testid="issue.views.field.single-line-text-inline-edit.read-view.customfield_14548"]');
            if (uniqueProjectCodeElement != null) {
                uniqueProjectCode = uniqueProjectCodeElement.textContent;
            }

            // if found add reference
            if (uniqueProjectCode != '') {
                let airTableButton = document.createElement('button');
                airTableButton.setAttribute('class', 'css-1xewsy6');
                airTableButton.setAttribute('type', 'button');
                airTableButton.setAttribute('onclick', 'window.open(\'https://airtable.com/appvIpUKeCZPt2kAq/tbllPW0bNpMusk8Ss/viwDIHGD8fwIU2FS4/' + uniqueProjectCode + '?blocks=hide\')');
                // airTableButton.innerHTML += 'Airtable <svg width="16" height="16" viewBox="0 0 13 13" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" xmlns="http://www.w3.org/2000/svg"><path d="M5.99751 5L10.4975 5C10.7737 5 10.9975 5.22386 10.9975 5.5L10.9975 10C10.9975 10.2761 10.7737 10.5 10.4975 10.5C10.2214 10.5 9.99751 10.2761 9.99751 10L9.99751 6.70711L4.48711 12.2175L3.78 11.5104L9.29041 6L5.99751 6C5.72137 6 5.49751 5.77614 5.49751 5.5C5.49751 5.22386 5.72137 5 5.99751 5Z"></path></svg>';
                airTableButton.innerHTML += 'Airtable&nbsp;&nbsp;<svg width="15" height="15" viewBox="0 -3 24 24" role="presentation"><g fill="currentColor"><path d="M19.005 19c-.003 0-.005.002-.005.002l.005-.002zM5 19.006c0-.004-.002-.006-.005-.006H5v.006zM5 4.994V5v-.006zM19 19v-6h2v6.002A1.996 1.996 0 0119.005 21H4.995A1.996 1.996 0 013 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2H5v14h14zM5 4.994V5v-.006zm0 14.012c0-.004-.002-.006-.005-.006H5v.006zM11 5H5v14h14v-6h2v6.002A1.996 1.996 0 0119.005 21H4.995A1.996 1.996 0 013 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2zm8 0v3a1 1 0 002 0V4a1 1 0 00-1-1h-4a1 1 0 000 2h3z"></path><path d="M12.707 12.707l8-8a1 1 0 10-1.414-1.414l-8 8a1 1 0 001.414 1.414z"></path></g></svg>';
                airTableDiv.appendChild(airTableButton);
            }
        }
    }
})();