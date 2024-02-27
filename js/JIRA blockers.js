// ==UserScript==
// @name         JIRA blockers
// @namespace    http://tampermonkey.net/
// @version      2.1
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
    let linksReverse = ['is blocking', 'Predecessor'];
    let now = new Date();
    const cache_limit_minutes = 120;
    
    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        checkFlag
    );

    async function checkFlag(element) {
        let board = document.querySelector("[data-onboarding-observer-id='board-wrapper']");
        if (board != null)
        {
            const runFlag = board.getAttribute('custom_blockers_run_flag');
            if (runFlag == null || runFlag != 'true') {
                board.setAttribute('custom_blockers_run_flag', 'true');
                checkCachedBoard();
                mainLoop();
                board.setAttribute('custom_blockers_run_flag', 'false');
            }
        }
    }

    async function mainLoop() {
        let progressBar = null;
        // progress bar doesn't work
        // let ghxOperations = document.querySelector("[data-testid='software-filters.ui.filter-selection-bar.filter-selection-bar']");
        // if (ghxOperations != null) {
        //     progressBar = document.createElement('div'); // create a progress bar
        //     progressBar.innerHTML = '<div class="progress-container" style="height: 0.4rem; width: 12rem;border-radius: 0.2rem; background: #000;"><div class="progress" id="bar_element" style="height: 100%;width: 0;border-radius: 0.2rem;background: #ff4754;transition: width 0.4s ease;"></div></div>'
        //     ghxOperations.appendChild(progressBar);
        // }
        // const changeProgress = (progress) => {
        //     let bar = document.getElementById('bar_element');
        //     if (bar != null) {
        //         bar.style.width = `${progress}%`;
        //     }
        // };
        await new Promise(resolve => setTimeout(resolve, 5000));
        let cards = document.getElementsByClassName('_1e0c1ule _1reo15vq _18m915vq _1bto1l2s _1wyb1crf _k48pni7l _syaz1o15');
        for (let j = 0; j < cards.length; j++) {
            let card = cards[j];
            const cardKey = card.textContent; // task number
            let cardContainer = card.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            const cardContainerClass = cardContainer.getAttribute('class');
            if (cardContainerClass == 'yse7za_content sc-1e1lt9n-1 iAeHCG') {
                // console.log("==================== " + cardKey);
                // issue card
                const blockersProcessed = cardContainer.getAttribute('blockers_processed');
                if (blockersProcessed == null || blockersProcessed != 'true') {
                    processIssueCard(cardContainer, cardKey);
                    cardContainer.setAttribute('blockers_processed', 'true');
                }
            }
            // changeProgress((j + 1) / cards.length * 100);
        }
        // if (progressBar != null) { //delete a progress bar
        //     let navParent = progressBar.parentNode
        //     if (navParent != null) {
        //         navParent.removeChild(progressBar);
        //     }
        // }
    }

    async function processIssueCard(card, key) {
        let jiraIssue = null;
        let flag = false;
        if (localStorage.getItem(key) == null) {
            flag = true;
        } else {
            jiraIssue = JSON.parse(localStorage.getItem(key));
            let timing = jiraIssue['time_created'];
            timing = new Date(timing);
            let different = now - timing;
            let dif = Math.round(different / 60000);
            if (dif > cache_limit_minutes) {
                flag = true;
            }
        }
        if (flag == true) {
            const response = await fetch('/rest/api/2/issue/' + key + '?fields=issuelinks');
            if (response.status == 200) {
                jiraIssue = await response.json();
                jiraIssue['time_created'] = now;
                jiraIssue = JSON.stringify(jiraIssue);
                localStorage.setItem(key, jiraIssue);
            }
        } else {
            jiraIssue = JSON.parse(localStorage.getItem(key));
        }

        jiraIssue = JSON.parse(localStorage.getItem(key));
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
                        await appendLink(card, issuelink, direction, true);
                    } else if (issuelinks[g]['type'][direction] == linksReverse[z]) {
                        await appendLink(card, issuelink, direction, false);
                    }
                }
            }
        }
    }

    // append blocker to the issue card
    async function appendLink(card, issuelink, direction, forBlocker) {
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
                let blockersContainer = await getBlockersContainer(card, forBlocker);
                if (blockersContainer != null) {
                    blockersContainer.appendChild(element);
                }
            }
        }
    }

    // returns div of the blockers, creates it if need
    async function getBlockersContainer(card, forBlocker) {
        let div = card.querySelector("[id='blockers_container']");
        if (div == null) {
            let element = document.createElement('div');
            element.setAttribute('id', 'blockers_container');
            element.style.setProperty('max-width', 'none');
            element.style.setProperty('display', 'flex');
            element.style.setProperty('justify-content', 'space-between');
            let leftDiv = document.createElement('div');
            leftDiv.setAttribute('id', 'blockers_container_left');
            leftDiv.style.setProperty('max-width', '50%');
            let rightDiv = document.createElement('div');
            rightDiv.setAttribute('id', 'blockers_container_right');
            rightDiv.style.setProperty('max-width', '50%');
            element.appendChild(leftDiv);
            element.appendChild(rightDiv);
            card.appendChild(element);
            div = element;
        }
        let blockersContainer = div.querySelector(forBlocker ? "[id='blockers_container_left']" : "[id='blockers_container_right']");
        return blockersContainer;
    }

    async function checkCachedBoard() {
        // @Bito
        // make rest api call to jira
    }
})();