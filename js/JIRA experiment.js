// ==UserScript==
// @name         JIRA experiment
// @namespace    http://tampermonkey.net/
// @version      1
// @description  hide unnecessary elements
// @author       You
// @match        https://tinypass.atlassian.net/issues/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://apis.google.com/js/api.js
// ==/UserScript==

(function () {
    'use strict';

    waitForKeyElements(
        '<div class="saved-search-operations">',
        appendButtons
    );

    function appendButtons(element) {
        const content = document.getElementById('custom_experiment_button');
        if (content == null) {
            let container = document.getElementById('filter-header__favourite-btn-container');
            if (container != null) {
                let expandButton = document.createElement('li');
                expandButton.className = 'sc-11jaxx1-0 LppZN';
                expandButton.innerHTML = '<button aria-pressed="false" class="css-1e2j28g" type="button" tabindex="0" id="custom_experiment_button"><span class="css-19r5em7">[experiment]</span></button>';
                expandButton.addEventListener('click', function () {
                    onClick()
                }, false);
                container.appendChild(expandButton);
            }
        }
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    async function intializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        // gapiInited = true;
        // maybeEnableButtons();
    }

    async function onClick() {
        const searchText = document.getElementById('advanced-search');
        console.log(searchText.value);
        // const title = 'test';
        // gapi.load('client', intializeGapiClient);
        // try {
        //     gapi.client.sheets.spreadsheets.create({
        //         properties: {
        //             title: title,
        //         },
        //     }).then((response) => {
        //         // if (callback) callback(response);
        //         console.log('Spreadsheet ID: ' + response.result.spreadsheetId);
        //     });
        // } catch (err) {
        //     document.getElementById('content').innerText = err.message;
        //     return;
        // }
    }

})();