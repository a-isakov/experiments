// ==UserScript==
// @name         JIRA focus board
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  hide unnecessary elements
// @author       You
// @match        https://tinypass.atlassian.net/jira/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements (
        '<div id="content" class="z-index-content">',
        appendButtons
    );

    function appendButtons(element) {
        const content = document.getElementById('custom_expand_button');
        if (content == null) {
            let filters = document.getElementById('ghx-quick-filters');
            if (filters != null) {
                let subFilters = filters.getElementsByTagName("ul");
                if (subFilters != null) {
                    if (subFilters.length == 2) {
                        let subFilter = subFilters[1]
                        let expandButton = document.createElement('li');
                        expandButton.className = 'sc-1gvv0kj-0 biXMbB';
                        expandButton.innerHTML = '<button aria-pressed="false" class="css-1f7f0z2" type="button" tabindex="0" id="custom_expand_button"><span class="css-178ag6o">[X]</span></button>';
                        expandButton.addEventListener('click', function() {
                            customExpandListener()
                        }, false);
                        subFilter.appendChild(expandButton);
                    }
                }
            }
        }
    }

    function customExpandListener() {
        const expandButton = document.getElementById('custom_expand_button');
        let expandButtonPressed = getButtonPressed(expandButton);
        expandButtonPressed = !expandButtonPressed; // invert state after hitting the button
        setButtonPressed(expandButton, expandButtonPressed);

        let topParent = null
        // remove left sidebar
        let navDiv = document.getElementById('ak-side-navigation');
        if (navDiv != null) {
            navDiv = navDiv.parentNode
            if (navDiv != null) {
                let navParent = navDiv.parentNode
                if (navParent != null) {
                    updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
                }
            }
        }
        // remove top menu
        navDiv = document.getElementById('ak-jira-navigation');
        if (navDiv != null) {
            navDiv = navDiv.parentNode
            if (navDiv != null) {
                let navParent = navDiv.parentNode
                if (navParent != null) {
                    updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
                    topParent = navParent;
                }
            }
        }
        // remove grid style
        if (topParent != null) {
            updateElement(topParent, 'display', expandButtonPressed ? 'flex' : '', false);
        }
        // remove navigation breadcrumbs
        navDiv = document.querySelector("[data-testid='rapidboard-breadcrumbs']")
        if (navDiv != null) {
            let navParent = navDiv.parentNode
            if (navParent != null) {
                updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
                topParent = navParent;
            }
        }
        // remove sprint name
        navDiv = document.getElementById('ghx-header');
        if (navDiv != null) {
            let navParent = navDiv.parentNode
            if (navParent != null) {
                updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
                topParent = navParent;
            }
        }
        // remove top quick filters
        let filters = document.getElementById('ghx-quick-filters');
        if (filters != null) {
            updateElement(filters, 'margin-bottom', expandButtonPressed ? '6px' : '', false);
            if (filters.childNodes.length == 2) {
                let subFilter = filters.childNodes[0];
                let peopleFilter = subFilter.childNodes[1];
                let quickFilters = filters.childNodes[1];
                quickFilters.insertBefore(peopleFilter, quickFilters.childNodes[0]); // move people filter before quick filters block
                updateElement(subFilter, 'display', expandButtonPressed ? 'none' : '', false);
            } else if (filters.childNodes.length == 1) {
                let subFilter = filters.childNodes[0];
                let filterBlockToRemove = subFilter.childNodes[0];
                updateElement(filterBlockToRemove, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // remove insight button
        navDiv = document.getElementById('ghx-controls-buttons');
        if (navDiv != null) {
            let navParent = navDiv.parentNode
            if (navParent != null) {
                updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
                topParent = navParent;
            }
        }
        // expand content
        updateElement(document.documentElement, '--leftSidebarWidth', expandButtonPressed ? '0px' : '', true);
        updateElement(document.getElementById('ghx-work'), 'height', expandButtonPressed ? `${window.innerHeight - 60}px` : '', false);
        const items = Array.from(
            document.getElementsByClassName('ghx-xtra-narrow-card')
        );
        let content = document.getElementById('content');
        updateElement(content, 'margin-left', expandButtonPressed ? '6px' : '', false);
        let poolColumn = document.getElementById('ghx-pool-column');
        updateElement(poolColumn, 'padding-right', expandButtonPressed ? '16px' : '', false);
        // resize columns' captions
        let captions = document.getElementsByClassName('ghx-column');
        for (let i = 0; i < captions.length; i++) {
            let caption = captions[i];
            updateElement(caption, 'padding', expandButtonPressed ? '6px' : '', false);
        }

        items.forEach(item => {
            // item.style.backgroundColor = 'purple';
            updateElement(item, 'padding', expandButtonPressed ? '1px' : '', false);
        });
        // console.log('------------------------');
    }

    function getButtonPressed(button) {
        const state = button.getAttribute('aria-pressed');
        return state == 'true';
    }

    function setButtonPressed(button, pressed) {
        if (pressed) {
            button.setAttribute('aria-pressed', 'true');
            button.setAttribute('class', 'css-370xbg');
        } else {
            button.setAttribute('aria-pressed', 'false');
            button.setAttribute('class', 'css-1f7f0z2');
        }
    }

    async function updateElement(element, styleName, newValue, log) {
        if (newValue != '') {
            const styleValue = window.getComputedStyle(element).getPropertyValue(styleName);
            if (log) {
                console.log(element);
                console.log('WAS: ' + styleValue + '. NOW: ' + newValue);
            }
            element.setAttribute('backup-' + styleName, styleValue);
            element.style.setProperty(styleName, newValue);
        } else {
            const backupStyle = element.getAttribute('backup-' + styleName);
            if (log) {
                console.log('WAS: ' + element.style.getPropertyValue(styleName) + '. NOW: ' + backupStyle);
            }
            element.style.setProperty(styleName, backupStyle);
        }
    }
})();