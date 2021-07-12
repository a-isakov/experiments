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
    if (elements.length > 0) {
        const jiraKey = document.getElementById('key-val').textContent;

        let completeButton = document.createElement('div');
        completeButton.className = 'aui-buttons pluggable-ops';
        completeButton.innerHTML = '<span class="aui-button toolbar-trigger issueaction-workflow-transition trigger-label">Complete</span>';
        completeButton.addEventListener('click', function() {
            customCloserListener(jiraKey, true)
        }, false);
        elements[0].appendChild(completeButton);

        let rejectButton = document.createElement('div');
        rejectButton.className = 'aui-buttons pluggable-ops';
        rejectButton.innerHTML = '<span class="aui-button toolbar-trigger issueaction-workflow-transition trigger-label">Reject</span>';
        rejectButton.addEventListener('click', function() {
            customCloserListener(jiraKey, false)
        }, false);
        elements[0].appendChild(rejectButton);
    }

    function customCloserListener(jiraKey, complete) {
        closeSubtasks(jiraKey, complete);
        closeJira(jiraKey, complete);
        // window.location.reload();
    }

    function closeSubtasks(jiraKey, complete) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const subtasks = JSON.parse(request.responseText);
                subtasks.forEach(element => {
                    closeJira(element['key'], complete);
                });
            }
        };
        request.open('GET', '/rest/api/2/issue/' + jiraKey + '/subtask', true);
        request.send();
    }

    function closeJira(jiraKey, complete) {
        console.log('This will close ' + jiraKey + ' as ' + complete);
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const jiraIssue = JSON.parse(request.responseText);
                const status = jiraIssue['fields']['status']['name'];
                const type = jiraIssue['fields']['issuetype']['name'];
                
                if (status != 'Closed') {
                    closeByWorkflow(jiraKey, type, status, complete);
                }
            }
        };
        request.open('GET', '/rest/api/2/issue/' + jiraKey + '?fields=issuetype,status', true);
        request.send();
    }
    
    function closeByWorkflow(jiraKey, type, status, complete) {
        console.log('TYPE: ' + type);
        console.log('STATUS: ' + status);

        const nextStatus = defineNextStatus(type, status);

        let transitionsRequest = new XMLHttpRequest();
        transitionsRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let transitionId = -1;
                const transitionsReponse = JSON.parse(transitionsRequest.responseText);
                // console.log(transitionsReponse);
                transitionsReponse['transitions'].forEach(transition => {
                    if (transition['to']['name'] == nextStatus) {
                        transitionId = transition['id'];
                        // console.log(transitionId);
                    }
                });
    
                if (transitionId != -1) {
                    const resolution = (complete == true ? 'Done' : 'Won\'t Do');
                    let moveRequest = new XMLHttpRequest();
                    moveRequest.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 204) {
                            console.log(jiraKey + ' moved to ' + nextStatus);
                            closeByWorkflow(jiraKey, type, nextStatus, complete);
                        }
                    };
                    moveRequest.open('POST', '/rest/api/2/issue/' + jiraKey + '/transitions?expand=transitions.fields', true);
                    moveRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
                    if (nextStatus == 'Closed') {
                        moveRequest.send(JSON.stringify({'fields': {'resolution': {'name': resolution}}, 'transition': {'id': transitionId}}));
                    } else {
                        moveRequest.send(JSON.stringify({'transition': {'id': transitionId}}));
                    }
                }
            }
        };
        transitionsRequest.open('GET', '/rest/api/2/issue/' + jiraKey + '/transitions', true);
        transitionsRequest.send();
    }

    function defineNextStatus(type, status) {
        let nextStatus = '';
        switch (type) {
            case 'Sub-task':
                nextStatus = defineNextSubTaskStatus(status);
                break;
        }
        return nextStatus;
    }

    function defineNextSubTaskStatus(status) {
        switch (status) {
            case 'Open':
                return 'In progress';
            case 'Waiting for rework':
            case 'Ready for publish':
                return 'Closed';
            case 'In progress':
                return 'Ready for test';
            case 'Ready for test':
                return 'In Testing';
            case 'In Testing':
                return 'Ready for publish';
        }
        return '';
    }
})();