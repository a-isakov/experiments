// ==UserScript==
// @name         JIRA focus board
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

(function() {
    'use strict';

    waitForKeyElements (
        '<div id="content" class="z-index-content">',
        appendButtons
    );
    // GM_registerMenuCommand('Expand content', customExpandListener, 'E');

    // function nothing() {
    //     console.log('++++++');
    // }

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
                        expandButton.className = 'sc-11jaxx1-0 LppZN';
                        expandButton.innerHTML = '<button aria-pressed="false" class="css-1e2j28g" type="button" tabindex="0" id="custom_expand_button"><span class="css-19r5em7">[X]</span></button>';
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
        let topParent = null
        // remove left sidebar
        let navDiv = document.getElementById('ak-side-navigation');
        if (navDiv != null) {
            navDiv = navDiv.parentNode
            if (navDiv != null) {
                let navParent = navDiv.parentNode
                if (navParent != null) {
                    navParent.removeChild(navDiv);
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
                    navParent.removeChild(navDiv);
                    topParent = navParent;
                }
            }
        }
        // remove grid style
        if (topParent != null) {
            topParent.style.display = "flex";
        }
        // remove navigation breadcrumbs
        navDiv = document.querySelector("[data-testid='rapidboard-breadcrumbs']")
        if (navDiv != null) {
            let navParent = navDiv.parentNode
            if (navParent != null) {
                navParent.removeChild(navDiv);
                topParent = navParent;
            }
        }
        // remove sprint name
        navDiv = document.getElementById('ghx-header');
        if (navDiv != null) {
            let navParent = navDiv.parentNode
            if (navParent != null) {
                navParent.removeChild(navDiv);
                topParent = navParent;
            }
        }
        // remove top quick filters
        let filters = document.getElementById('ghx-quick-filters');
        if (filters != null) {
            let subFilters = filters.getElementsByTagName("ul");
            if (subFilters != null) {
                if (subFilters.length == 2) {
                    let subFilter = subFilters[0]
                    let navParent = subFilter.parentNode
                    if (navParent != null) {
                        navParent.removeChild(subFilter);
                    }
                }
            }
        }
    // remove insight button
        navDiv = document.getElementById('ghx-controls-buttons');
        if (navDiv != null) {
            let navParent = navDiv.parentNode
            if (navParent != null) {
                navParent.removeChild(navDiv);
                topParent = navParent;
            }
        }
        // expand content
        document.documentElement.style.setProperty('--leftSidebarWidth', '0px');
        // console.log('------------------------');
    }
})();