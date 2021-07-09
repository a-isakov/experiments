// ==UserScript==
// @name         JIRA Closer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       You
// @match        https://team.akbars.ru/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const elements = document.getElementsByClassName('aui-toolbar2-primary');
    console.log('================================');
    if (elements.length > 0) {
        const jiraKey = document.getElementById('key-val').textContent;
        console.log(jiraKey);

        let button = document.createElement('div');
        button.className = 'aui-buttons pluggable-ops';
        button.innerHTML = '<span class="aui-button toolbar-trigger issueaction-workflow-transition trigger-label">Totally close</span>';
        button.addEventListener('click', function() {
            customCloserListener(jiraKey)
        }, false);
        elements[0].appendChild(button);
    }

    function customCloserListener(jiraKey) {
        closeSubtasks(jiraKey);
        closeJira(jiraKey);
    }

    function closeSubtasks(jiraKey) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const subtasks = JSON.parse(request.responseText);
                subtasks.forEach(element => {
                    closeJira(element['key']);
                });
            }
        };
        request.open('GET', '/rest/api/2/issue/' + jiraKey + '/subtask', true);
        request.send();
    }

    function closeJira(jiraKey) {
        console.log('This will close ' + jiraKey);
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const jiraIssue = JSON.parse(request.responseText);
                const status = jiraIssue['fields']['status']['name'];
                const type = jiraIssue['fields']['issuetype']['name'];
                
                closeByWorkflow(jiraKey, type, status);
            }
        };
        request.open('GET', '/rest/api/2/issue/' + jiraKey + '?fields=issuetype,status', true);
        request.send();
    }
    
    function closeByWorkflow(jiraKey, type, status) {
        console.log('TYPE: ' + type);
        console.log('STATUS: ' + status);
        
    }
})();