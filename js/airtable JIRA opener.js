// ==UserScript==
// @name         airtable JIRA opener
// @namespace    http://tampermonkey.net/
// @version      1
// @description  enables to open JIRA from airtable record
// @author       You
// @match        https://airtable.com/appvIpUKeCZPt2kAq/tbllPW0bNpMusk8Ss/viwDIHGD8fwIU2FS4*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function () {
    'use strict';

    const FAKE_ID = 'custom_air_jira_button';

    waitForKeyElements (
        '<div class="fieldLabel quiet text-dark break-word white-space-normal">Unique Project Code (UPC)</div>',
        appendJIRAButton
    );

    function appendJIRAButton() {
        const customButton = document.getElementById(FAKE_ID);
        if (customButton != null) {
            return;
        }
        let uniqueProjectCode = getUniqueProjectCode();
        if (uniqueProjectCode != '') {
            let record = document.querySelector('[data-testid="DetailViewWithActivityFeed"]');
            if (record != null) {
                let flag = document.createElement('div');
                flag.setAttribute('id', FAKE_ID);
                record.appendChild(flag);
                let labelContainer = record.getElementsByClassName('labelContainer mb1');
                if (labelContainer != null) {
                    let baseline = labelContainer[0].getElementsByClassName('flex-auto flex-inline items-baseline');
                    if (baseline != null) {
                        let jiraButton = document.createElement('div');
                        jiraButton.setAttribute('class', 'fieldLabel quiet text-dark truncate');
                        jiraButton.setAttribute('style', 'margin-left: 10px');
                        jiraButton.innerHTML += 'Find in JIRA <svg width="12" height="12" viewBox="0 0 16 16" class="noevents" style="shape-rendering: geometricprecision;"><path fill-rule="evenodd" fill="currentColor" d="M6.1485,10.2969 C4.1335,10.2969 2.5005,8.6639 2.5005,6.6489 C2.5005,4.6339 4.1335,2.9999 6.1485,2.9999 C8.1635,2.9999 9.7965,4.6339 9.7965,6.6489 C9.7965,8.6639 8.1635,10.2969 6.1485,10.2969 M14.2075,12.6429 L11.0995,9.7069 C11.0555,9.6629 10.9995,9.6419 10.9505,9.6079 C11.4835,8.7459 11.7965,7.7339 11.7965,6.6489 C11.7965,3.5339 9.2635,0.9999 6.1485,0.9999 C3.0335,0.9999 0.5005,3.5339 0.5005,6.6489 C0.5005,9.7629 3.0335,12.2969 6.1485,12.2969 C7.1495,12.2969 8.0885,12.0329 8.9045,11.5739 C8.9455,11.6409 8.9765,11.7129 9.0355,11.7709 L12.1435,14.7069 C12.5335,15.0979 13.1665,15.0979 13.5575,14.7069 L14.2075,14.0569 C14.5975,13.6669 14.5975,13.0339 14.2075,12.6429"></path></svg>';
                        jiraButton.setAttribute('onclick', 'window.open(\'https://tinypass.atlassian.net/issues/?jql=%22Unique%20Project%20Code%5BShort%20text%5D%22%20~%20%22' + uniqueProjectCode + '%22\')');
                        baseline[0].appendChild(jiraButton);
                    }
                }
            }
        }
    }

    function getUniqueProjectCode() {
        let tags = document.getElementsByTagName('div');
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].textContent == 'Unique Project Code (UPC)') {
                let found = tags[i];
                if (found.getAttribute('class') == 'labelContainer mr2 mt-half') {
                    if (found.parentNode != null) {
                        if (found.parentNode.childNodes.length >= 2) {
                            return found.parentNode.childNodes[1].textContent;
                        }
                    }
                }
            }
        }
        return '';
    }
})();