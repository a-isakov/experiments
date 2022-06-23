// ==UserScript==
// @name         JIRA blockers
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
    'use strict';
    let links = ['is blocked by', 'Predecessor'];

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
                        expandButton.className = 'sc-11jaxx1-0 LppZN';
                        expandButton.innerHTML = '<button aria-pressed="false" class="css-1e2j28g" type="button" tabindex="0" id="custom_blockers_button"><span class="css-19r5em7">[Blockers]</span></button>';
                        expandButton.addEventListener('click', function () {
                            Buttons()
                        }, false);
                        subFilter.appendChild(expandButton);
                    }
                }
            }
        }
    }

    async function Buttons() {
        await new Promise(resolve => setTimeout(resolve, 3000));
        let divs = document.getElementsByClassName("ghx-issue");
        for (let i = 0; i < divs.length; i++) {
            let div = divs[i];
            let cards = div.getElementsByClassName("ghx-key");
            for (let j = 0; j < cards.length; j++) {
                let card = cards[j];
                let card_key = card.getAttribute("aria-label");  // task number
                const response = await fetch('/rest/api/2/issue/' + card_key + '?fields=issuelinks');
                if (response.status == 200) {
                    const jiraIssue = await response.json();
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
                                        if (div != null && div.childElementCount > 0) { // append blockers links
                                            let element = document.createElement('div');
                                            let check_links = linkedissue['fields']['status']['statusCategory']['key'];
                                            if (check_links != 'done') {
                                                element.innerHTML = '<a  href="https://tinypass.atlassian.net/browse/' + linked_number + '" class="aui-lozenge  ghx-label-14" style="font-size:70%" onclick="window.open(\'https://tinypass.atlassian.net/browse/' + linked_number + '\')" >' + linked_number + '</a>';
                                            } else {
                                                element.innerHTML = '<a  href="https://tinypass.atlassian.net/browse/' + linked_number + '" class="aui-lozenge  ghx-label-6" style="text-decoration: line-through; font-size:70%" onclick="windiw.open(\'https://tinypass.atlassian.net/browse/' + linked_number + '\')">' + linked_number + '</a>';
                                            }
                                            div.appendChild(element);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})();