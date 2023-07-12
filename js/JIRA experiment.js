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


    async function get_statusCategory(id){
        const response = await fetch('/rest/api/3/status/' + id)
        if (response.status == 200) {
            let id_of_task = id;
            let result_for_status = await response.json();
            let certain_id = result_for_status['statusCategory']['id'];
            if (localStorage.getItem(id_of_task) === null){
                localStorage.setItem(id_of_task, certain_id);
                return  await localStorage.getItem(id_of_task);
            }else{
                return await localStorage.getItem(id_of_task);
            }
        }
  }

    async function onClick() {
        let arr = new Array();
        let k = 0;
        const searchText = document.getElementById('advanced-search');
        let encoded = encodeURI(searchText.value);
        const response = await fetch('/rest/api/3/search?jql=' + encoded + '&expand=changelog&fields=key,summary,status,created,resolution');
                if (response.status == 200) {
                    let answer = await response.json();
                    let issues = answer['issues'];
                    for (let i = 0; i < issues.length; i++) {
                        let issue = issues[i];
                        let time_created = issue['fields']['created'];
                        let resolution = issue['fields']['resolution'];
                        let issue_changelog = issue["changelog"]["histories"];
                        if (issue_changelog.length != 0){
                            let begin = null;
                            let finish = null;
                            let issueKey = issue["key"];
                            for (let j = 0; j < issue_changelog.length; j++){
                                let changes = issue_changelog[j];
                                let change = changes["items"];
                                for (let e = 0; e < change.length; e++){
                                    if(typeof change[e].fieldId !== 'undefined' && (change[e].fieldId === 'status')){
                                        k += 1;
                                        arr[k - 1] = changes["created"]
                                        let id = change[e]["to"];
                                        let check = await get_statusCategory(id);
                                        if (check == 4 | check == 2){
                                            begin = changes["created"];
                                        }
                                        if (check == 3){
                                            finish = changes["created"];
                                        }
                                    }
                                }
                            }
                            let flag = true;
                            if (begin === null | finish === null){
                                flag = false;
                            }
                            if (flag == true){
                                begin = new Date(begin);
                                finish = new Date(finish);
                                let different = finish - begin;
                                if ((different/3600000) >= 1){
                                    let dif = Math.round(different/3600000);
                                    console.log('time contributed for task number '+ issueKey + ' is ' + dif +  ' hours');
                                }
                                if ((different/3600000) < 1){
                                    console.log('time contributed for task number '+ issueKey + ' is ' + different/60000 + ' minutes');
                                }
                                if (resolution !== null){
                                    console.log('resolution of task number ' + issueKey + ' ' + (resolution['name']));
                                }
                            }
                            if (finish === null && begin !== null){
                                console.log('start time of work on task number '+ issueKey + ' is ' + begin);
                            }
                            if (begin === null && finish !== null ){
                                begin = new Date(time_created);
                                finish = new Date(finish);
                                let different = finish - begin;
                                //console.log(begin);
                                //console.log(finish);
                                if ((different/3600000) >= 1){
                                    let dif = Math.round(different/3600000);
                                    console.log('task number ' + issueKey + ' was closed without any other steps. Time after creation ' + dif + ' hours' );
                                }
                                if ((different/3600000) < 1){
                                    console.log('task number ' + issueKey + ' was closed without any other steps. Time after creation ' + different/60000 + ' minutes');
                                }
                                if (resolution !== null){
                                    console.log('resolution of task number ' + issueKey + ' is ' + (resolution['name']));
                                }
                            }
                            if (begin === null && finish === null){
                                begin = time_created;
                                console.log('work on ' + issueKey + ' has not started yet, however task was created at ' + begin);
                            }
                            arr = [];
                            k = 0;
                        }
                    }
                }
    }
})();