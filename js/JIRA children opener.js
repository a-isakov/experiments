// ==UserScript==
// @name         JIRA children opener
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  enables to open children tasks
// @author       You
// @match        https://tinypass.atlassian.net/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    const FAKE_ID = 'custom_children_open_button';

    waitForKeyElements (
        '<div class="sc-1njt3iw-0 klZhqF">',
        appendOpenChildrenButton
    );

    async function appendOpenChildrenButton() {
        const customButton = document.getElementById(FAKE_ID);
        if (customButton != null) {
            return;
        }
        let sortButton = document.querySelector('[data-testid="issue.views.common.child-issues-panel.heading.sort-by-menu.trigger-button"]');
        if (sortButton != null) {
            let buttonsContainer = sortButton.parentNode;
            if (buttonsContainer != null) {

                let openerDiv = document.createElement('div');
                openerDiv.setAttribute('id', FAKE_ID); // insert unique div to prevent duplicated execution
                openerDiv.setAttribute('class', '_18u012x7');

                let openerButton = document.createElement('button');
                openerButton.setAttribute('class', 'css-db1avo');
                openerButton.setAttribute('type', 'button');
                openerButton.addEventListener('click', function() {
                    customChildrenOpenListener(sortButton.parentNode.parentNode.parentNode)
                }, false);
                openerDiv.appendChild(openerButton);

                let openerSpan = document.createElement('span');
                openerSpan.setAttribute('class', 'css-bwxjrz');
                openerButton.appendChild(openerSpan);

                let imageSpan = document.createElement('span');
                imageSpan.setAttribute('class', 'css-1wits42');
                imageSpan.innerHTML += '<svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><g fill="currentColor"><path d="M19.005 19c-.003 0-.005.002-.005.002l.005-.002zM5 19.006c0-.004-.002-.006-.005-.006H5v.006zM5 4.994V5v-.006zM19 19v-6h2v6.002A1.996 1.996 0 0119.005 21H4.995A1.996 1.996 0 013 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2H5v14h14zM5 4.994V5v-.006zm0 14.012c0-.004-.002-.006-.005-.006H5v.006zM11 5H5v14h14v-6h2v6.002A1.996 1.996 0 0119.005 21H4.995A1.996 1.996 0 013 19.006V4.994C3 3.893 3.896 3 4.997 3H11v2zm8 0v3a1 1 0 002 0V4a1 1 0 00-1-1h-4a1 1 0 000 2h3z"></path><path d="M12.707 12.707l8-8a1 1 0 10-1.414-1.414l-8 8a1 1 0 001.414 1.414z"></path></g></svg>';
                openerSpan.appendChild(imageSpan);

                buttonsContainer.appendChild(openerDiv);
            }
        }
    }

    function customChildrenOpenListener(childrenPanel) {
        if (confirm('Are you sure you want to open all children?')){
            const children = childrenPanel.querySelector('[data-testid="issue.issue-view.views.common.child-issues-panel.issues-container"]');
            const lines = children.getElementsByClassName('w4juse-1 lmnboH');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const key = line.querySelector('[data-testid="issue.issue-view.views.common.issue-line-card.issue-line-card-view.key"]');
                window.open('https://tinypass.atlassian.net/browse/' + key.textContent);
            }
        }
    }
})();