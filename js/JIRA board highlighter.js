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
        let cards = boardContainer.getElementsByClassName('ghx-issue');
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            // bring days count
            if (showDelays) {
                let daysReminders = card.getElementsByClassName('ghx-days');
                for (let j = 0; j < daysReminders.length; j++) {
                    let reminder = daysReminders[j];
                    const daysText = reminder.getAttribute('data-tooltip');
                    const daysValue = parseInt(daysText);
                    if (daysValue < delayMin) {
                        continue;
                    }
                    let remiderText = document.createElement('div');
                    if (daysValue <= delayMax) {
                        remiderText.setAttribute('class', 'ghx-label-6');
                    } else {
                        remiderText.setAttribute('class', 'ghx-label-14');
                    }
                    remiderText.textContent = daysText;
                    card.appendChild(remiderText);
                }
            }
        }
    }
})();