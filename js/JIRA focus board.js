// ==UserScript==
// @name         JIRA focus board
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
                        expandButton.innerHTML = '<button aria-pressed="false" class="css-7q1vr1" type="button" tabindex="0" id="custom_expand_button"><span class="css-178ag6o">[X]</span></button>';
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
            filters.style.marginBottom = '6px';
            if (filters.childNodes.length == 2) {
                let subFilter = filters.childNodes[0];
                let peopleFilter = subFilter.childNodes[1];
                let quickFilters = filters.childNodes[1];
                quickFilters.insertBefore(peopleFilter, quickFilters.childNodes[0]); // move people filter before quick filters block
                filters.removeChild(subFilter);
            } else if (filters.childNodes.length == 1) {
                let subFilter = filters.childNodes[0];
                let filterBlockToRemove = subFilter.childNodes[0];
                subFilter.removeChild(filterBlockToRemove);
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
        document.getElementById('ghx-work').style.height = `${window.innerHeight - 60}px`;
        const items = Array.from(
            document.getElementsByClassName('ghx-xtra-narrow-card')
        );
        let content = document.getElementById('content');
        content.style.marginLeft = '6px';
        let poolColumn = document.getElementById('ghx-pool-column');
        poolColumn.style.paddingRight = '16px';
        // resize columns' captions
        let captions = document.getElementsByClassName('ghx-column');
        for (let i = 0; i < captions.length; i++) {
            let caption = captions[i];
            caption.style.padding = '6px';
        }

        items.forEach(item => {
            // item.style.backgroundColor = 'purple';
            item.style.padding = '1px';
            console.log('fix');
        });
        // console.log('------------------------');
    }
})();