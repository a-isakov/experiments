// ==UserScript==
// @name         JIRA board highlighter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  hide unnecessary elements
// @author       You
// @match        https://tinypass.atlassian.net/jira/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function () {
    const showDelays = true; // show value of the days in column
    const delayMin = 2;      // min days to show delays to indicate in green
    const delayMax = 5;      // max days to indicate in red

    const clickableEpics = true; // enables opening of the epics by clicking on epics name on issue card

    let counter = 0;

    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        onElement
    );

    function onElement(element) {
        const content = document.getElementById('custom_highlighter');
        if (content == null) {
            // let boardContainer = document.getElementById('ghx-pool-wrapper');
            let boardContainer = document.getElementById('ghx-pool');
            if (boardContainer != null) {
                let onceElement = document.createElement('div');
                onceElement.setAttribute('id', 'custom_highlighter');
                onceElement.setAttribute('counter', counter++); // just to reflect updates count
                boardContainer.appendChild(onceElement);
                onRefresh(boardContainer);
            }
        }
    }

    function onRefresh(boardContainer) {
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
                }
            }
        }
    }
})();