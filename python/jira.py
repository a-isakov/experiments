import requests
import html
from datetime import datetime
import csv
import json

def getJIRAStatuses(jiraURL, statuses):
    url = jiraURL + 'status'
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        recs = response.json()
        for rec in recs:
            statuses[rec['id']] = (rec['name'], rec['statusCategory']['name'])

def getJIRAIssueTransitions(jiraURL, sessionID, headers, key, statuses, jiraData):
    url = jiraURL + 'issue/' + key + '?expand=changelog&fields=issuetype,summary'
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        fields = response.json()['fields']
        # (key, summary, type, { status: (category, duration) })
        jiraRec = (key, fields['summary'], fields['issuetype']['name'], {})
        lastTime = ''
        histories = response.json()['changelog']['histories']
        for history in histories:
            items = history['items']
            for item in items:
                if item['field'] == 'status':
                    statusFrom = item['from']
                    # statusTo = item['to']
                    time = datetime.strptime(history['created'], '%Y-%m-%dT%H:%M:%S.%f%z')
                    if statusFrom in statuses:
                        statusFromName, statusFromCategory = statuses[statusFrom]
                    else:
                        statusFromName = 'Unknown'
                        statusFromCategory = 'Unknown'
                    # statusToName, statusToCategory = statuses[statusTo]
                    # print('[' + statusFromName + ' (' + statusFromCategory + ')] => [' + statusToName + ' (' + statusToCategory + ')] at ' + history['created'])

                    if lastTime != '':
                        timeInStatus = time - lastTime
                        _, _, _, jiraContent = jiraRec
                        if statusFromName not in jiraContent:
                            jiraContent[statusFromName] = (statusFromCategory, timeInStatus)
                        else:
                            _, jiraTimeInStatus = jiraContent[statusFromName]
                            jiraContent[statusFromName] = (statusFromCategory, jiraTimeInStatus + timeInStatus)

                    lastTime = time
        jiraData.append(jiraRec)

sessionID = '50FACA84A0C3F32BACA4ED72A54B3794'
headers = {'Accept': 'application/json', 'Content-Type': 'application/json', 'Cookie': 'JSESSIONID=' + sessionID}
jiraURL = 'https://team.akbars.ru/rest/api/2/'
limit = 100

jiraData = []

statuses = dict()
getJIRAStatuses(jiraURL, statuses)

# jql = 'project = KP AND type not in (Epic) ORDER BY key DESC'
jql = 'key in (KP-3550, KP-3736, KP-3742)'
searchURL = jiraURL + 'search'
params = {
    'jql': jql,
    'startAt': 0,
    'maxResults': limit,
    'fields': ['key']
}
response = requests.post(searchURL, data=json.dumps(params), headers=headers)
if response.status_code == 200:
    while True:
        startAt = response.json()['startAt']
        maxResults = response.json()['maxResults']
        total = response.json()['total']

        issues = response.json()['issues']
        print(len(issues), 'items from', startAt, 'of', total)
        for issue in issues:
            getJIRAIssueTransitions(jiraURL, sessionID, headers, issue['key'], statuses, jiraData)

        if startAt + maxResults >= total:
            break
        else:
            params['startAt'] = startAt + maxResults
            response = requests.post(searchURL, data=json.dumps(params), headers=headers)
            if response.status_code != 200:
                break

print(len(jiraData), 'issues collected')
counter = 0
with open('jira-statuses.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    for i in range(len(jiraData)):
        jiraRec = jiraData[i]
        jiraKey, jiraSummary, jiraType, jiraStatuses = jiraRec
        for jiraStatus in jiraStatuses:
            jiraStatusCategory, jiraStatusDuration = jiraStatuses[jiraStatus]
            total_seconds = jiraStatusDuration.seconds + jiraStatusDuration.days*24*60*60
            writer.writerow([jiraKey, jiraSummary, jiraType, jiraStatus, jiraStatusCategory, total_seconds])
            counter += 1
print(counter, 'lines saved')
