// ==UserScript==
// @name         JIRA board highlighter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  hide unnecessary elements
// @author       You
// @match        https://tinypass.atlassian.net/jira/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function () {
    const showDelays = true; // show value of the days in column
    const delayMin = 2;      // min days to show delays to indicate in green
    const delayMax = 5;      // max days to indicate in red
    const removeDots = true; // remove dots after showing text delays

    const clickableEpics = true; // enables opening of the epics by clicking on epics name on issue card

    let counter = 0;
    let boardCacheChecked = false;
    let boardCacheLoaded = false;

    const cachePrefix = 'duration_';
    const processedCardTag = 'duration_processed';

    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        onElement
    );

    async function onElement(element) {
        const content = document.getElementById('custom_highlighter');
        if (content == null) {
            let boardContainer = document.getElementById('ghx-pool');
            if (boardContainer != null) {
                // old JIRA UI
                let onceElement = document.createElement('div');
                onceElement.setAttribute('id', 'custom_highlighter');
                onceElement.setAttribute('counter', counter++); // just to reflect updates count
                boardContainer.appendChild(onceElement);
                onRefreshOld(boardContainer);
            } else {
                // new JIRA UI
                checkBoardCache();
                onRefreshNew();
            }
            // wait for 1 second before next review
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async function checkBoardCache() {
        if (!boardCacheChecked) {
            boardCacheChecked = true;
            const urlParts = document.URL.split('/');
            const boardIdParts = urlParts[urlParts.length - 1].split('?');
            const boardId = boardIdParts[0];
            // load board data
            const response = await fetch('/rest/boards/latest/board/' + boardId + '?hideCardExtraFields=true&moduleKey=agile-mobile-board-service&onlyUseEpicsFromIssues=true&skipEtag=true');
            if (response.status == 200) {
                const boardData = await response.json();
                const columns = boardData['columns'];
                if (columns != null) {
                    for (let i = 0; i < columns.length; i++) {
                        const column = columns[i];
                        const issues = column['issues'];
                        for (let j = 0; j < issues.length; j++) {
                            const issue = issues[j];
                            const jiraKey = issue['key'];
                            const duration = parseInt(issue['currentTimeInColumnMillis'] / (1000 * 60 * 60 * 24));
                            // store issue duration in cache
                            localStorage.setItem(cachePrefix + jiraKey, duration);
                        }
                    }
                    boardCacheLoaded = true;
                }
            }
        }
    }

    async function onRefreshNew() {
        if (boardCacheLoaded) {
            // console.log('Cache loaded');
            await new Promise(resolve => setTimeout(resolve, 5000));
            let cards = document.getElementsByClassName('_1e0c1ule _1reo15vq _18m915vq _1bto1l2s _1wyb1crf _k48pni7l _syaz1o15');
            for (let j = 0; j < cards.length; j++) {
                let card = cards[j];
                const cardKey = card.textContent; // task number
                if (localStorage.getItem(cachePrefix + cardKey) != null) {
                    let cardContainer = card.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    const cardContainerClass = cardContainer.getAttribute('class');
                    if (cardContainerClass == 'yse7za_content sc-1e1lt9n-1 iAeHCG') {
                        // issue card
                        const blockersProcessed = cardContainer.getAttribute(processedCardTag);
                        if (blockersProcessed == null || blockersProcessed != 'true') {
                            processIssueCard(cardContainer, cardKey);
                            cardContainer.setAttribute(processedCardTag, 'true');
                        }
                    }
                }
            }
        }
    }

    // add days into JIRA card and hide dots if need
    async function processIssueCard (card, key) {
        if (card != null && card.parentNode.childElementCount > 0) {
            const daysValue = localStorage.getItem(cachePrefix + key);
            let element = document.createElement('div');
            if (daysValue <= delayMax) {
                element.setAttribute('class', 'aui-lozenge ghx-label-6');
            } else {
                element.setAttribute('class', 'aui-lozenge ghx-label-14');
            }
            element.setAttribute('style', 'font-size:70%');
            element.innerHTML = localStorage.getItem(cachePrefix + key) + ' days';
            card.appendChild(element);
            // remove dots
            if (removeDots) {
                let dotsContainer = card.getElementsByClassName('_4t3i1osq _1e0c1txw _4cvr1h6o _1bah1h6o _zulpv77o')[0];
                if (dotsContainer != null) {
                    let dotsContainerParent = dotsContainer.parentNode;
                    dotsContainerParent.removeChild(dotsContainer);
                }
            }
        }
}

    function onRefreshOld(boardContainer) {
        // make epic clickable
        if (clickableEpics) {
            let epics = boardContainer.getElementsByClassName("aui-lozenge");
            for (let ec = 0; ec < epics.length; ec++) {
                let epic = epics[ec];
                let data_epickey = epic.getAttribute("data-epickey");
                if (data_epickey != null) {
                    // console.log(epic);
                    let epic_class = epic.getAttribute("class");
                    let epic_title = epic.getAttribute("title");
                    let parent = epic.parentNode;
                    parent.removeChild(epic);
                    let new_epic = document.createElement('span');
                    new_epic.setAttribute('class', epic_class);
                    new_epic.setAttribute('title', epic_title);
                    new_epic.setAttribute('data-epickey', data_epickey);
                    new_epic.setAttribute('onclick', 'window.open(\'https://tinypass.atlassian.net/browse/' + data_epickey + '\')');
                    new_epic.textContent = epic_title;
                    parent.appendChild(new_epic);
                }
            }
        }

        let cards = boardContainer.getElementsByClassName('ghx-issue');
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            // bring days count to card
            if (showDelays) {
                let daysReminders = card.getElementsByClassName('ghx-days');
                for (let j = 0; j < daysReminders.length; j++) {
                    let reminder = daysReminders[j];
                    let daysText = reminder.getAttribute('data-tooltip');
                    if (daysText == null) {
                        daysText = reminder.getAttribute('title'); // Alternative way of reporting that
                    }
                    const daysValue = parseInt(daysText);
                    if (daysValue < delayMin) {
                        continue;
                    }
                    let remiderText = document.createElement('div');
                    if (daysValue <= delayMax) {
                        remiderText.setAttribute('class', 'aui-lozenge ghx-label-6');
                    } else {
                        remiderText.setAttribute('class', 'aui-lozenge ghx-label-14');
                    }
                    remiderText.textContent = daysText;
                    card.appendChild(remiderText);
                    // remove dots
                    if (removeDots) {
                        let reminderParent = reminder.parentNode;
                        reminderParent.removeChild(reminder);
                    }
                }
            }
        }
    }
})();