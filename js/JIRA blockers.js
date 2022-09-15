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

    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        appendButtons
    );

    function appendButtons(element) {
        const content = document.getElementById('custom_blockers_button');
        if (content == null) {
            let filters = document.getElementById('ghx-quick-filters');
            if (filters != null) {
                let subFilters = filters.getElementsByTagName("ul");
                if (subFilters != null) {
                    if (subFilters.length == 2) {
                        let subFilter = subFilters[1]
                        let expandButton = document.createElement('li');
                        expandButton.className = 'sc-1gvv0kj-0 biXMbB';
                        expandButton.innerHTML = '<button aria-pressed="false" class="css-7uss0q" type="button" tabindex="0" id="custom_blockers_button"><span class="css-19r5em7">[blockers]</span></button>';
                        expandButton.addEventListener('click', function () {
                            Buttons()
                        }, false);
                        subFilter.appendChild(expandButton);
                    }
                }
            }
        }
    }

    async function Buttons(element) {
        let progress_bar = document.createElement('li'); // create a progress bar
        let filters = document.getElementById('ghx-quick-filters');
        if (filters != null) {
            let subFilters = filters.getElementsByTagName("ul");
            if (subFilters != null) {
                let subFilter = subFilters[subFilters.length - 1];
                progress_bar.innerHTML = '<div class="progress-container" style="height: 0.4rem; width: 12rem;border-radius: 0.2rem; background: #000;"><div class="progress" id="bar_element" style="height: 100%;width: 0;border-radius: 0.2rem;background: #ff4754;transition: width 0.4s ease;"></div></div>'
                subFilter.appendChild(progress_bar);
            }
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
                                    card_container.appendChild(element);
                                }
                            }
                        }
                    }
                }
            }
            changeProgress((j + 1) / cards.length * 100);
        }
        if (progress_bar != null) { //delete a progress bar
            let navParent = progress_bar.parentNode
            if (navParent != null) {
                navParent.removeChild(progress_bar);
            }
        }
    }
})();