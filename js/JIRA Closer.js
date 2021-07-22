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
            ]).then(() => {
                console.log('done');
                window.location.reload();
            })
        }
    }

    async function closeSubtasks(jiraKey, complete) {
        const response = await fetch('/rest/api/2/issue/' + jiraKey + '/subtask'); // retrieve list of subtasks
        if (response.status == 200) {
            const subtasks = await response.json();
            for (const subtask of subtasks) {
                await closeJira(subtask['key'], complete);
            }
        }
    }

    async function closeJira(jiraKey, complete) {
        console.log('This will close ' + jiraKey + ' as ' + complete);
        const response = await fetch('/rest/api/2/issue/' + jiraKey + '?fields=issuetype,status'); // retrieve issue details to close
        if (response.status == 200) {
            const jiraIssue = await response.json();
            // console.log(jiraIssue);
            const status = jiraIssue['fields']['status']['id'];
            const type = jiraIssue['fields']['issuetype']['id'];
            if (status != STATUS_CLOSED) {
                await closeByWorkflow(jiraKey, type, status, complete);
            }
        }
    }
    
    // closes issues following the JIRA workflow
    async function closeByWorkflow(jiraKey, type, status, complete) {
        console.log('TYPE: ' + type);
        console.log('STATUS: ' + status);

        const nextStatus = await defineNextStatus(type, status);
        console.log('NEXT STATUS: ' + nextStatus);
        if (nextStatus == 0) {
            return;
        }

        const transitionsReponse = await fetch('/rest/api/2/issue/' + jiraKey + '/transitions'); // check available transitions
        if (transitionsReponse.status == 200) {
            const transitions = await transitionsReponse.json();
            // console.log(transitions);
            // looking for transition with target status
            for (const transition of transitions['transitions']) {
                if (transition['to']['id'] == nextStatus) {
                    const transitionId = transition['id'];
                    // console.log(transitionId);
                    let data = '';
                    if (nextStatus == STATUS_CLOSED) {
                        const resolution = (complete == true ? 'Done' : 'Won\'t Do');
                        data = JSON.stringify({'fields': {'resolution': {'name': resolution}}, 'transition': {'id': transitionId}});
                    } else {
                        data = JSON.stringify({'transition': {'id': transitionId}});
                    }
                    // do the status change
                    const moveResponse = await fetch('/rest/api/2/issue/' + jiraKey + '/transitions?expand=transitions.fields', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                        },
                        body: data
                    });
                    if (moveResponse.status == 204) {
                        console.log(jiraKey + ' moved to ' + nextStatus);
                        await closeByWorkflow(jiraKey, type, nextStatus, complete); // follow the workflow until get closed
                    }
                }
            }
        }
    }

    async function defineNextStatus(type, status) {
        let nextStatus = 0;
        switch (Number(type)) {
            case TYPE_SUBTASK:
                nextStatus = await defineNextSubTaskStatus(status);
                break;
            case TYPE_USER_STORY:
            case TYPE_TEAM_ENABLER:
                nextStatus = await defineNextUserStoryStatus(status);
                break;
            case TYPE_TECHNICAL_TASK:
                nextStatus = await defineNextTechnialTaskStatus(status);
                break;
            case TYPE_EPIC:
                nextStatus = await defineNextEpicStatus(status);
                break;
        }
        return nextStatus;
    }

    async function defineNextSubTaskStatus(status) {
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

    async function defineNextUserStoryStatus(status) {
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

    async function defineNextTechnialTaskStatus(status) {
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

    async function defineNextEpicStatus(status) {
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