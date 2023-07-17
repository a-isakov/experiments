// ==UserScript==
// @name         JIRA epic filter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  filter by epic
// @author       You
// @match        https://tinypass.atlassian.net/jira/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function () {
    let counter = 0;

    waitForKeyElements(
        '<div id="content" class="z-index-content">',
        onElement
    );

    function onElement(element) {
        const content = document.getElementById('custom_epic_filter');
        if (content == null) {
            let boardContainer = document.getElementById('ghx-pool');
            if (boardContainer != null) {
                let onceElement = document.createElement('div');
                onceElement.setAttribute('id', 'custom_epic_filter');
                onceElement.setAttribute('counter', counter++); // just to reflect updates count
                boardContainer.appendChild(onceElement);
                // onRefresh(boardContainer);
            }
        }
        const epicsButton = document.getElementById('custom_epics_button');
        if (epicsButton == null) {
            let boardContainer = document.getElementById('ghx-pool');
            if (boardContainer != null) {
                let filters = document.getElementById('ghx-quick-filters');
                if (filters != null) {
                    let subFilters = filters.getElementsByTagName("ul");
                    if (subFilters != null) {
                        if (subFilters.length == 2) {
                            insertPopup(filters);
                            let subFilter = subFilters[1]
                            let epicFilterButton = document.createElement('li');
                            epicFilterButton.className = 'sc-1gvv0kj-0 biXMbB';
                            epicFilterButton.innerHTML = '<button epic="" aria-pressed="false" class="css-1f7f0z2" type="button" tabindex="0" id="custom_epics_button"><span class="css-178ag6o"><img src="https://tinypass.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/11407?size=medium" class="_1reo15vq _18m915vq"></img></span></button>';
                            epicFilterButton.addEventListener('click', function() {
                                showEpicsList(boardContainer)
                            }, false);
                            subFilter.appendChild(epicFilterButton);
                        }
                    }
                }
            }
        }
    }

    function insertPopup(parent) {
        let popupDiv = document.createElement('div');
        popupDiv.setAttribute('id', 'epic_popup');
        let style = 'position: fixed; ';
        style += 'top: 0; ';
        style += 'left: 0; ';
        style += 'width: 100%; ';
        style += 'height: 100%; ';
        style += 'background-color: rgba(0, 0, 0, 0.5); ';
        style += 'display: flex; ';
        style += 'justify-content: center; ';
        style += 'align-items: center; ';
        style += 'z-index: 9999; ';
        style += 'visibility: hidden;';
        popupDiv.setAttribute('style', style);
        
        let popupContent = document.createElement('div');
        popupContent.setAttribute('id', 'epic_popup_content');
        style = 'position: relative; ';
        style += 'background-color: #fff; ';
        style += 'padding: 20px; ';
        style += 'border-radius: 5px;';
        popupContent.setAttribute('style', style);
        popupDiv.appendChild(popupContent);

        appendCloseButton(popupContent);

        parent.appendChild(popupDiv);
    }

    function appendCloseButton(parent) {
        let popupCloseButton = document.createElement('button');
        popupCloseButton.setAttribute('type', 'button');
        popupCloseButton.addEventListener('click', function() {
            closePopup()
        }, false);
        popupCloseButton.innerText = 'Close';
        parent.appendChild(popupCloseButton);
    }

    function closePopup() {
        const popup = document.getElementById('epic_popup');
        popup.style.visibility = 'hidden';
    }

    function showEpicsList(boardContainer) {
        const epicsButton = document.getElementById('custom_epics_button');
        const epicKey = epicsButton.getAttribute('epic');
        if (epicKey == '')
        {
            // find all Epics
            let popupContent = document.getElementById('epic_popup_content');
            popupContent.innerHTML = ''; // erase
            let epics = boardContainer.getElementsByClassName('aui-lozenge');
            let clonedEpics = {};
            for (let ec = 0; ec < epics.length; ec++) {
                let epic = epics[ec];
                let data_epickey = epic.getAttribute('data-epickey');
                if (data_epickey != null) {
                    let epic_class = epic.getAttribute('class');
                    let epic_title = epic.getAttribute('title');
                    let epicClone = document.createElement('span');
                    epicClone.setAttribute('class', epic_class);
                    epicClone.setAttribute('title', epic_title);
                    epicClone.setAttribute('data-epickey', data_epickey);
                    epicClone.textContent = epic_title;
                    epicClone.addEventListener('click', function() {
                        filterEpic(data_epickey, epicClone)
                    }, false);
                    clonedEpics[data_epickey] = epicClone;
                }
            }
            for (let key in clonedEpics) {
                popupContent.appendChild(clonedEpics[key]);
                popupContent.appendChild(document.createElement('br'));
            }
            appendCloseButton(popupContent);
            // shop popup to select the Epic
            const popup = document.getElementById('epic_popup');
            popup.style.visibility = 'visible';
        } else {
            // reset
            filterEpic('', null);
        }
    }

    function filterEpic(epicKey, epic) {
        const doFilter = epicKey != '';
        closePopup();
        let epicsButton = document.getElementById('custom_epics_button');
        if (!doFilter) {
            epicsButton.setAttribute('epic', '');
            // epicsButton.setAttribute('aria-pressed', 'false');
            // epicsButton.setAttribute('class', 'css-1f7f0z2');
            epicsButton.innerHTML = '<span class="css-178ag6o"><img src="https://tinypass.atlassian.net/rest/api/2/universal_avatar/view/type/issuetype/avatar/11407?size=medium" class="_1reo15vq _18m915vq"></img></span>';
        } else {
            epicsButton.setAttribute('epic', epicKey);
            // epicsButton.setAttribute('aria-pressed', 'true');
            // epicsButton.setAttribute('class', 'css-370xbg');
            epicsButton.innerHTML = '';
            let span = document.createElement('span');
            span.setAttribute('class', 'css-178ag6o');
            span.appendChild(epic);
            epicsButton.appendChild(span);
        }
        // find all cards
        let boardContainer = document.getElementById('ghx-pool');
        let popupContent = document.getElementById('epic_popup_content');
        popupContent.innerHTML = ''; // erase
        let cards = boardContainer.getElementsByClassName('ghx-issue');
        for (let ec = 0; ec < cards.length; ec++) {
            let card = cards[ec];
            const epics = card.getElementsByClassName('aui-lozenge');
            let data_epickey = '';
            for (let i = 0; i < epics.length; i++) {
                let attr = epics[i].getAttribute('data-epickey');
                if (attr != null) {
                    data_epickey = attr;
                }
            }
            if (data_epickey != '') {
                // card.style.visibility = (doFilter && data_epickey != epicKey) ? 'hidden' : 'visible';
                card.style.display = (doFilter && data_epickey != epicKey) ? 'none' : 'block';
            } else {
                // card.style.visibility = doFilter ? 'hidden' : 'visible';
                card.style.display = doFilter ? 'none' : 'block';
            }
        }
    }
})();