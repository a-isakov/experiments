// ==UserScript==
// @name         JIRA blockers
// @namespace    http://tampermonkey.net/
// @version      1
// @description  hide unnecessary elements
// @author       You
// @match        https://tinypass.atlassian.net/jira/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function () {
    'use strict';
    let links = ['is blocked by', 'Successor'];
    let now = new Date();
    const cache_limit_minutes = 120;
    let counter = 0;
    let breakMainLoop = false;
    let isMainLoopRunning = false;
    let testCounter = 0;
    
    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        appendButtons
    );

    async function appendButtons(element) {
        const runFlag = document.getElementById('custom_blockers_run_flag');
        if (runFlag == null) {
            let boardContainer = document.getElementById('ghx-pool');
            if (boardContainer != null) {
                let onceElement = document.createElement('div');
                onceElement.setAttribute('id', 'custom_blockers_run_flag');
                onceElement.setAttribute('counter', counter++); // just to reflect updates count
                boardContainer.appendChild(onceElement);
                // console.log('-------------------');
                // console.log('isMainLoopRunning: ' + isMainLoopRunning);
                // console.log('breakMainLoop: ' + breakMainLoop);
                // console.log('testCounter: ' + testCounter);
                // break loop if it was running
                if (isMainLoopRunning) {
                    breakMainLoop = true;
                    while (breakMainLoop) {
                        console.log('waiting');
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
                ++testCounter;
                mainLoop();
            }
        }
    }

    // async function testLoop() {
    //     isMainLoopRunning = true;
    //     while (true) {
    //         await new Promise(resolve => setTimeout(resolve, 2000));
    //         console.log('testCounter: ' + testCounter);
    //         if (breakMainLoop) {
    //             console.log('caught breakMainLoop');
    //             isMainLoopRunning = false;
    //             breakMainLoop = false;
    //             break;
    //         }
    //     }
    // }

    async function mainLoop(element) {
        isMainLoopRunning = true; // indicate main loop started
        let progress_bar = document.createElement('div'); // create a progress bar
        let ghxOperations = document.getElementById('ghx-operations');
        if (ghxOperations != null) {
            progress_bar.innerHTML = '<div class="progress-container" style="height: 0.4rem; width: 12rem;border-radius: 0.2rem; background: #000;"><div class="progress" id="bar_element" style="height: 100%;width: 0;border-radius: 0.2rem;background: #ff4754;transition: width 0.4s ease;"></div></div>'
            ghxOperations.appendChild(progress_bar);
        }
        const changeProgress = (progress) => {
            let bar = document.getElementById('bar_element');
            bar.style.width = `${progress}%`;
        };
        // await new Promise(resolve => setTimeout(resolve, 3000));
        let cards = document.getElementsByClassName("ghx-key");
        for (let j = 0; j < cards.length; j++) {
            let card = cards[j];
            let card_key = card.getAttribute("aria-label"); // task number
            if (card_key == null) {
                // that happens for subtasks because parent doesn't have full body
                continue;
            }
            let card_container = card.parentNode.parentNode.parentNode;

            let jiraIssue = null;
            let flag = false;
            if (localStorage.getItem(card_key) == null) {
                flag = true
            } else {
                jiraIssue = JSON.parse(localStorage.getItem(card_key));
                let timing = jiraIssue["time_created"];
                timing = new Date(timing);
                let different = now - timing;
                let dif = Math.round(different / 60000);
                if (dif > cache_limit_minutes) {
                    flag = true;
                }
            }
            if (flag == true) {
                const response = await fetch('/rest/api/2/issue/' + card_key + '?fields=issuelinks');
                if (response.status == 200) {
                    jiraIssue = await response.json();
                    jiraIssue["time_created"] = now;
                    jiraIssue = JSON.stringify(jiraIssue);
                    localStorage.setItem(card_key, jiraIssue);
                }
            } else {
                jiraIssue = JSON.parse(localStorage.getItem(card_key));
            }

            jiraIssue = JSON.parse(localStorage.getItem(card_key));
            let fields = jiraIssue['fields'];
            let issuelinks = fields['issuelinks'];
            if (issuelinks.length != 0) {
                for (let g = 0; g < issuelinks.length; g++) {
                    let issuelink = issuelinks[g];
                    let direction = '';
                    if ('inwardIssue' in issuelink) {   // check rather we have inwardIssue or outwardIssue
                        direction = 'inward';
                    } else if ('outwardIssue' in issuelink) {
                        direction = 'outward';
                    }
                    for (let z = 0; z < links.length; z++) {
                        if (issuelinks[g]['type'][direction] == links[z]) { // choose necessary Linked issues
                            let linkedissue = issuelink[direction + 'Issue'];
                            if (linkedissue != null && direction != '') {
                                let linked_number = issuelink[direction + 'Issue']['key']; // conected task number
                                if (card != null && card.parentNode.childElementCount > 0) { // create button
                                    let element = document.createElement('div');
                                    let check_links = linkedissue['fields']['status']['statusCategory']['key'];
                                    if (check_links != 'done') {
                                        element.innerHTML = '<a  href="https://tinypass.atlassian.net/browse/' + linked_number + '" class="aui-lozenge ghx-label-14" style="font-size:70%" onclick="window.open(\'https://tinypass.atlassian.net/browse/' + linked_number + '\')" >' + linked_number + '</a>';
                                    }
                                    if (check_links == 'done') {
                                        element.innerHTML = '<a  href="https://tinypass.atlassian.net/browse/' + linked_number + '" class="aui-lozenge ghx-label-6" style="text-decoration: line-through; font-size:70%" onclick="windiw.open(\'https://tinypass.atlassian.net/browse/' + linked_number + '\')">' + linked_number + '</a>';
                                    }
                                    // check if it wasn't stopped
                                    if (!breakMainLoop) {
                                        // continue;
                                        card_container.appendChild(element);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // check if it needs to stop
            if (breakMainLoop) {
                if (progress_bar != null) { //delete a progress bar
                    let navParent = progress_bar.parentNode
                    if (navParent != null) {
                        navParent.removeChild(progress_bar);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 500));
                isMainLoopRunning = false; // indicate main loop stopped
                breakMainLoop = false; // reset break flag
                return;
            }
            changeProgress((j + 1) / cards.length * 100);
        }
        if (progress_bar != null) { //delete a progress bar
            let navParent = progress_bar.parentNode
            if (navParent != null) {
                navParent.removeChild(progress_bar);
            }
        }
        isMainLoopRunning = false; // indicate main loop finished
    }
})();