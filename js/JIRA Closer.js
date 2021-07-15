// ==UserScript==
// @name         JIRA Closer
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       You
// @match        https://team.akbars.ru/browse/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    const TYPE_SUBTASK = 10102;
    const TYPE_USER_STORY = 12400;
    const TYPE_TEAM_ENABLER = 12401;
    const TYPE_TECHNICAL_TASK = 12700;
    const TYPE_EPIC = 10000;

    const STATUS_OPEN = 10500;
    const STATUS_WAITING_FOR_REWORK = 12703;
    const STATUS_IN_PROGRESS = 10600;
    const STATUS_READY_FOR_TEST = 10106;
    const STATUS_IN_TESTING = 11120;
    const STATUS_READY_FOR_ACCEPTANCE = 12708;
    const STATUS_ACCEPTANCE = 12709;
    const STATUS_ANALYSED = 12704;
    const STATUS_READY_TO_IMPL = 12705;
    const STATUS_HYPOTHESIS_VERIFICATION = 12700;
    const STATUS_ON_HOLD = 12706;
    const STATUS_READY_FOR_PUBLISH = 12707;
    const STATUS_CLOSED = 6;

    waitForKeyElements (
        '<div class="aui-toolbar2-primary">', 
        appendButtons
    );
    
    function appendButtons() {
        // console.log('====================================');
        const element = document.getElementById('custom-complete-button');
        if (element == null) {
            const jiraStatus = document.getElementById('status-val').textContent.trim().toLowerCase();
            if (jiraStatus != 'closed' && jiraStatus != 'закрыт') {
                const elements = document.getElementsByClassName('aui-toolbar2-primary');
                if (elements.length > 0) {
                    const jiraKey = document.getElementById('key-val').textContent;
            
                    let completeButton = document.createElement('div');
                    completeButton.className = 'aui-buttons pluggable-ops';
                    completeButton.innerHTML = '<span id="custom-complete-button" class="aui-button toolbar-trigger issueaction-workflow-transition trigger-label">Complete</span>';
                    completeButton.addEventListener('click', function() {
                        customCloserListener(jiraKey, true)
                    }, false);
                    elements[0].appendChild(completeButton);
            
                    let rejectButton = document.createElement('div');
                    rejectButton.className = 'aui-buttons pluggable-ops';
                    rejectButton.innerHTML = '<span id="custom-reject-button" class="aui-button toolbar-trigger issueaction-workflow-transition trigger-label">Reject</span>';
                    rejectButton.addEventListener('click', function() {
                        customCloserListener(jiraKey, false)
                    }, false);
                    elements[0].appendChild(rejectButton);
                }
            }
        }
    }

    function customCloserListener(jiraKey, complete) {
        if (confirm('Are you sure you want to close the issue with all subtasks?')) {
            Promise.all([
                closeSubtasks(jiraKey, complete),
                closeJira(jiraKey, complete)
            ]).then(() => console.log('done'))
            // window.location.reload();
        }
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
        request.send(); // retrieve list of subtasks
    }

    function closeJira(jiraKey, complete) {
        console.log('This will close ' + jiraKey + ' as ' + complete);
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const jiraIssue = JSON.parse(request.responseText);
                const status = jiraIssue['fields']['status']['id'];
                const type = jiraIssue['fields']['issuetype']['id'];
                
                // console.log(jiraIssue);
                if (status != STATUS_CLOSED) {
                    closeByWorkflow(jiraKey, type, status, complete);
                }
            }
        };
        request.open('GET', '/rest/api/2/issue/' + jiraKey + '?fields=issuetype,status', true);
        request.send(); // retrieve issue details to close
    }
    
    // closes isses following the JIRA workflow
    function closeByWorkflow(jiraKey, type, status, complete) {
        console.log('TYPE: ' + type);
        console.log('STATUS: ' + status);

        const nextStatus = defineNextStatus(type, status);
        console.log('NEXT STATUS: ' + nextStatus);
        if (nextStatus == 0) {
            return;
        }

        let transitionsRequest = new XMLHttpRequest();
        transitionsRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let transitionId = -1;
                const transitionsReponse = JSON.parse(transitionsRequest.responseText);
                // console.log(transitionsReponse);
                transitionsReponse['transitions'].forEach(transition => {
                    // looking for transition with target status
                    if (transition['to']['id'] == nextStatus) {
                        transitionId = transition['id'];
                        // console.log(transitionId);
                    }
                });
    
                if (transitionId != -1) {
                    let moveRequest = new XMLHttpRequest();
                    moveRequest.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 204) {
                            console.log(jiraKey + ' moved to ' + nextStatus);
                            closeByWorkflow(jiraKey, type, nextStatus, complete); // follow the workflow until get closed
                        }
                    };
                    moveRequest.open('POST', '/rest/api/2/issue/' + jiraKey + '/transitions?expand=transitions.fields', true);
                    moveRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
                    // do the status change
                    if (nextStatus == STATUS_CLOSED) {
                        const resolution = (complete == true ? 'Done' : 'Won\'t Do');
                        moveRequest.send(JSON.stringify({'fields': {'resolution': {'name': resolution}}, 'transition': {'id': transitionId}}));
                    } else {
                        moveRequest.send(JSON.stringify({'transition': {'id': transitionId}}));
                    }
                }
            }
        };
        transitionsRequest.open('GET', '/rest/api/2/issue/' + jiraKey + '/transitions', true);
        transitionsRequest.send(); // check available transitions
    }

    function defineNextStatus(type, status) {
        let nextStatus = 0;
        switch (Number(type)) {
            case TYPE_SUBTASK:
                nextStatus = defineNextSubTaskStatus(status);
                break;
            case TYPE_USER_STORY:
            case TYPE_TEAM_ENABLER:
                nextStatus = defineNextUserStoryStatus(status);
                break;
            case TYPE_TECHNICAL_TASK:
                nextStatus = defineNextTechnialTaskStatus(status);
                break;
            case TYPE_EPIC:
                nextStatus = defineNextEpicStatus(status);
                break;
        }
        return nextStatus;
    }

    function defineNextSubTaskStatus(status) {
        switch (Number(status)) {
            case STATUS_OPEN:
                return STATUS_IN_PROGRESS;
            case STATUS_WAITING_FOR_REWORK:
            case STATUS_READY_FOR_PUBLISH:
                return STATUS_CLOSED;
            case STATUS_IN_PROGRESS:
                return STATUS_READY_FOR_TEST;
            case STATUS_READY_FOR_TEST:
                return STATUS_IN_TESTING;
            case STATUS_IN_TESTING:
                return STATUS_READY_FOR_PUBLISH;
        }
        return 0;
    }

    function defineNextUserStoryStatus(status) {
        switch (Number(status)) {
            case STATUS_OPEN:
            case STATUS_READY_FOR_PUBLISH:
                return STATUS_CLOSED;
            case STATUS_WAITING_FOR_REWORK:
                return STATUS_IN_PROGRESS;
            case STATUS_IN_PROGRESS:
                return STATUS_READY_FOR_TEST;
            case STATUS_READY_FOR_TEST:
                return STATUS_IN_TESTING;
            case STATUS_IN_TESTING:
                return STATUS_READY_FOR_PUBLISH;
        }
        return 0;
    }

    function defineNextTechnialTaskStatus(status) {
        switch (Number(status)) {
            case STATUS_OPEN:
            case STATUS_ACCEPTANCE:
                return STATUS_CLOSED;
            case STATUS_WAITING_FOR_REWORK:
                return STATUS_IN_PROGRESS;
            case STATUS_IN_PROGRESS:
                return STATUS_READY_FOR_ACCEPTANCE;
            case STATUS_READY_FOR_ACCEPTANCE:
                return STATUS_ACCEPTANCE;
        }
        return 0;
    }

    function defineNextEpicStatus(status) {
        switch (Number(status)) {
            case STATUS_OPEN:
            case STATUS_ON_HOLD:
                return STATUS_ANALYSED;
            case STATUS_ANALYSED:
                return STATUS_READY_TO_IMPL;
            case STATUS_READY_TO_IMPL:
                return STATUS_IN_PROGRESS;
            case STATUS_IN_PROGRESS:
                return STATUS_HYPOTHESIS_VERIFICATION;
            case STATUS_HYPOTHESIS_VERIFICATION:
                return STATUS_CLOSED;
        }
        return 0;
    }
})();