// ==UserScript==
// @name         JIRA focus board
// @namespace    http://tampermonkey.net/
// @version      2.2
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
            let filters = document.querySelector("[data-testid='software-filters.ui.filter-selection-bar.filter-selection-bar']");
            if (filters != null) {
                addExpandButton(filters);
            }
        }
    }

    function addExpandButton(parent) {
        let expandButton = document.createElement('span');
        expandButton.id = 'custom_expand_button';
        expandButton.setAttribute('aria-pressed', 'false');
        expandButton.innerHTML = '<svg width="20" height="20" viewBox="0 -4 24 24" role="presentation"><path d="M16.587 6.003H15A1 1 0 0115 4h3.9l.047.001a.975.975 0 01.736.285l.032.032c.2.2.296.47.284.736l.001.048v3.896a1 1 0 11-2 0V7.411l-3.309 3.308a.977.977 0 01-1.374-.005l-.032-.032a.976.976 0 01-.005-1.374l3.307-3.305zM7.413 17.997H9A1 1 0 019 20H5.1l-.047-.001a.975.975 0 01-.736-.285l-.032-.032A.977.977 0 014 18.946a1.12 1.12 0 010-.048v-3.896a1 1 0 112 0v1.587l3.309-3.308a.977.977 0 011.374.005l.032.032a.976.976 0 01.005 1.374l-3.307 3.305z" fill="currentColor" fill-rule="evenodd"></path></svg>';
        let expandButtonContainer = document.createElement('label');
        expandButtonContainer.className = getButtonStyle();
        expandButtonContainer.appendChild(expandButton);
        expandButtonContainer.addEventListener('click', function() {
            customExpandListener()
        }, false);
        parent.appendChild(expandButtonContainer);
    }

    function getButtonStyle() {
        let className = '_uiztglyw'; // fallback style
        //take release button
        const releaseButton = document.querySelector("[data-testid='software-board.header.release-version.trigger']");
        if (releaseButton != null) {
            className = releaseButton.getAttribute('class');
        } else {
            //take sprint button
            const sprintButton = document.querySelector("[data-testid='software-board.header.complete-sprint-button']");
            if (sprintButton != null) {
                className = sprintButton.getAttribute('class');
            } else {
                //take config button
                let configButton = document.querySelector("[data-testid='software-view-settings.ui.view-settings-button.responsive-button.expanded']");
                if (configButton == null) {
                    configButton = document.querySelector("[data-testid='software-view-settings.ui.view-settings-button.responsive-button.collapsed']");
                }
                if (configButton != null) {
                    className = configButton.getAttribute('class');
                } else {
                    // take standard expand button
                    const sprintButton = document.querySelector("[data-testid='platform.ui.fullscreen-button.fullscreen-button']");
                    if (sprintButton != null) {
                        className = sprintButton.getAttribute('class');
                    }
                }
            }
        }
        return className;
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
                updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // remove top menu
        navDiv = document.getElementById('ak-jira-navigation');
        if (navDiv != null) {
            navDiv = navDiv.parentNode
            if (navDiv != null) {
                let navParent = navDiv.parentNode;
                if (navParent != null) {
                    updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
                }
            }
        }
        // remove grid style
        if (topParent != null) {
            updateElement(topParent, 'display', expandButtonPressed ? 'flex' : '', false);
        }
        // remove navigation breadcrumbs
        navDiv = document.querySelector("[data-fullscreen-id='fullscreen-board-breadcrumbs']");
        if (navDiv != null) {
            updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
        }
        navDiv = document.querySelector("[data-fullscreen-id='fullscreen-backlog-breadcrumbs']");
        if (navDiv != null) {
            updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
        }
        // remove sprint name
        navDiv = document.querySelector("[data-testid='software-board.header.title.container']");
        if (navDiv != null) {
            let navParent = navDiv.parentNode.parentNode;
            if (navParent != null) {
                updateElement(navParent, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // remove backlog name
        navDiv = document.querySelector("[data-testid='platform.ui.fullscreen-button.fullscreen-button']");
        if (navDiv != null) {
            let navParent = navDiv.parentNode.parentNode.parentNode.parentNode.parentNode;
            if (navParent != null) {
                updateElement(navParent, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // remove top quick filters
        let assigneeFilters = document.querySelector("[data-testid='filters.ui.filters.assignee.stateless.assignee-filter']");
        let quickFilters = document.querySelector("[data-testid='software-filters.ui.filter-selection-bar.filter-selection-bar']");
        if (assigneeFilters != null && quickFilters != null)
        {
            const modified = quickFilters.getAttribute('focus_modified');
            if (modified == null || modified == '') {
                quickFilters.insertBefore(assigneeFilters.childNodes[1], quickFilters.childNodes[1]); // move people filter before quick filters block
                quickFilters.setAttribute('focus_modified', 'true');
            }
            updateElement(quickFilters.parentNode.parentNode.parentNode, 'margin-top', expandButtonPressed ? '0' : '', false);
            updateElement(quickFilters.parentNode.parentNode, 'margin-top', expandButtonPressed ? '0' : '', false);
            updateElement(quickFilters.parentNode, 'margin-bottom', expandButtonPressed ? '0' : '', false);
        }
        navDiv = document.querySelector("[data-testid='software-board.header.controls-bar']");
        if (navDiv != null) {
            updateElement(navDiv, 'display', expandButtonPressed ? 'none' : '', false);
        }
        // remove insight button
        navDiv = document.querySelector("[data-testid='insights-show-insights-button.ui.button-test-id-hide']");
        if (navDiv != null) {
            let navParent = navDiv.parentNode.parentNode.parentNode.parentNode;
            if (navParent != null) {
                updateElement(navParent, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // remove small settings button
        navDiv = document.querySelector("[data-testid='software-view-settings.ui.small-button']");
        if (navDiv != null) {
            let navParent = navDiv.parentNode.parentNode;
            if (navParent != null) {
                updateElement(navParent, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // remove big settings button
        navDiv = document.querySelector("[data-testid='software-view-settings.ui.large-button']");
        if (navDiv != null) {
            let navParent = navDiv.parentNode.parentNode;
            if (navParent != null) {
                updateElement(navParent, 'display', expandButtonPressed ? 'none' : '', false);
            }
        }
        // expand content
        updateElement(document.documentElement, '--leftSidebarWidth', expandButtonPressed ? '0px' : '', false);
        updateElement(document.documentElement, '--topNavigationHeight', expandButtonPressed ? '0px' : '', false);
    }

    function getButtonPressed(button) {
        const state = button.getAttribute('aria-pressed');
        return state == 'true';
    }

    function setButtonPressed(button, pressed) {
        if (pressed) {
            button.innerHTML = '<svg width="20" height="20" viewBox="0 -4 24 24" role="presentation"><path d="M16.413 8.997H18A1 1 0 0118 11h-3.9l-.047-.001a.975.975 0 01-.736-.285l-.032-.032A.977.977 0 0113 9.946a1.12 1.12 0 010-.048V6.002a1 1 0 112 0v1.587l3.309-3.308a.977.977 0 011.374.005l.032.032a.976.976 0 01.005 1.374l-3.307 3.305zm-8.826 6.006H6A1 1 0 016 13h3.9l.047.001a.975.975 0 01.736.285l.032.032c.2.2.296.47.284.736l.001.048v3.896a1 1 0 11-2 0v-1.587l-3.309 3.308a.977.977 0 01-1.374-.005l-.032-.032a.976.976 0 01-.005-1.374l3.307-3.305z" fill="currentColor" fill-rule="evenodd"></path></svg>'
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.innerHTML = '<svg width="20" height="20" viewBox="0 -4 24 24" role="presentation"><path d="M16.587 6.003H15A1 1 0 0115 4h3.9l.047.001a.975.975 0 01.736.285l.032.032c.2.2.296.47.284.736l.001.048v3.896a1 1 0 11-2 0V7.411l-3.309 3.308a.977.977 0 01-1.374-.005l-.032-.032a.976.976 0 01-.005-1.374l3.307-3.305zM7.413 17.997H9A1 1 0 019 20H5.1l-.047-.001a.975.975 0 01-.736-.285l-.032-.032A.977.977 0 014 18.946a1.12 1.12 0 010-.048v-3.896a1 1 0 112 0v1.587l3.309-3.308a.977.977 0 011.374.005l.032.032a.976.976 0 01.005 1.374l-3.307 3.305z" fill="currentColor" fill-rule="evenodd"></path></svg>';
            button.setAttribute('aria-pressed', 'false');
        }
    }

    async function updateElement(element, styleName, newValue, log /* for debugging */) {
        if (newValue != '') {
            // get original value, backup it and set new
            const styleValue = window.getComputedStyle(element).getPropertyValue(styleName);
            if (log) {
                console.log(element);
                console.log('WAS: ' + styleValue + '. NOW: ' + newValue);
            }
            element.setAttribute('backup-' + styleName, styleValue);
            element.style.setProperty(styleName, newValue);
        } else {
            // get original value from backup and restore it
            const backupStyle = element.getAttribute('backup-' + styleName);
            if (log) {
                console.log('WAS: ' + element.style.getPropertyValue(styleName) + '. NOW: ' + backupStyle);
            }
            element.style.setProperty(styleName, backupStyle);
        }
    }
})();