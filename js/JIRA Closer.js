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
                
                if (status.toLowerCase() != 'closed') {
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
        console.log('NEXT STATUS: ' + nextStatus);
        if (nextStatus == '') {
            return;
        }

        let transitionsRequest = new XMLHttpRequest();
        transitionsRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let transitionId = -1;
                const transitionsReponse = JSON.parse(transitionsRequest.responseText);
                // console.log(transitionsReponse);
                transitionsReponse['transitions'].forEach(transition => {
                    if (transition['to']['name'].toLowerCase() == nextStatus.toLowerCase()) {
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
    
                    if (nextStatus.toLowerCase() == 'closed') {
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
            case 'User Story':
            case 'Team Enabler':
                nextStatus = defineNextUserStoryStatus(status);
                break;
            case 'Technical Task':
                nextStatus = defineNextTechnialTaskStatus(status);
                break;
            case 'Epic':
                nextStatus = defineNextEpicStatus(status);
                break;
        }
        return nextStatus;
    }

    function defineNextSubTaskStatus(status) {
        switch (status.toLowerCase()) {
            case 'open':
                return 'in progress';
            case 'waiting for rework':
            case 'ready for publish':
                return 'closed';
            case 'in progress':
                return 'ready for test';
            case 'ready for test':
                return 'in testing';
            case 'in testing':
                return 'ready for publish';
        }
        return '';
    }

    function defineNextUserStoryStatus(status) {
        switch (status.toLowerCase()) {
            case 'open':
            case 'ready for publish':
                return 'closed';
            case 'waiting for Rework':
                return 'in progress';
            case 'in progress':
                return 'ready for test';
            case 'ready for test':
                return 'in testing';
            case 'in testing':
                return 'ready for publish';
        }
        return '';
    }

    function defineNextTechnialTaskStatus(status) {
        switch (status.toLowerCase()) {
            case 'open':
            case 'acceptance':
                return 'closed';
            case 'waiting for rework':
                return 'in progress';
            case 'in progress':
                return 'ready for acceptance';
            case 'ready for acceptance':
                return 'acceptance';
        }
        return '';
    }

    function defineNextEpicStatus(status) {
        switch (status.toLowerCase()) {
            case 'open':
            case 'on hold':
                return 'analysed';
            case 'analysed':
                return 'ready to impl';
            case 'ready to impl':
                return 'in progress';
            case 'in progress':
                return 'hypothesis verification';
            case 'hypothesis verification':
                return 'closed';
        }
        return '';
    }
})();