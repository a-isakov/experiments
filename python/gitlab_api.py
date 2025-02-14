import requests
import csv
import os.path
import unicodedata
import sys  # Importing sys to allow exiting the program

HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json', 'PRIVATE-TOKEN': 'token'}
GITLAB_URL = 'https://gitlab.com/api/v4/'
# AUTHOR_NAME = 'aydar.mukhametshin@piano.io'
# AUTHOR_NAME = 'mikhail.sherstyannikov@piano.io'
AUTHOR_NAME = 'ildar.timerbaev@piano.io'
# AUTHOR_NAME = 'ilshat.galimov@piano.io'
# AUTHOR_NAME = 'ildar.nabiev@piano.io'
REPORT_NAME = 'commits'
PROJECTS_FILE = 'projectIds.csv'
# SCAN_FIRST_DATE = '2023-01-01T00:00:00Z'
SCAN_FIRST_DATE = '2024-08-26T00:00:00Z'
PAGE_SIZE = 100

# returns all project IDs
def getProjectIds():
    page = 1
    projectIds = []
    while True:
        print('Request projects, page', page)
        params = {'visibility': 'private', 'order_by': 'id', 'per_page': PAGE_SIZE, 'page': page}
        url = GITLAB_URL + 'projects'
        response = requests.get(url, params, headers=HEADERS)
        if response.status_code != 200:
            break
        else:
            page += 1
            projects = response.json()
            for project in projects:
                # print(project['id'], project['path_with_namespace'])
                projectIds.append(project['id'])
            returned = len(projects)
            if returned < PAGE_SIZE:
                break
    print(len(projectIds), 'found.')
    return projectIds

# reads IDs of the projects from file
def readProjectIds():
    projectIds = []
    with open(PROJECTS_FILE, 'r', newline='') as csvFile:
        csvReader = csv.reader(csvFile, delimiter=',', dialect='excel')
        for projectId in csvReader:
            projectIds.append(projectId[0])
        csvFile.close()
    print(len(projectIds), 'projectIds read from', PROJECTS_FILE)
    return projectIds

# writes IDs of the projects into file
def writeProjectIds(projectIds):
    with open(PROJECTS_FILE, 'w', newline='') as csvFile:
        csvWriter = csv.writer(csvFile, delimiter=',', dialect='excel')
        for projectId in projectIds:
            csvWriter.writerow([projectId])
        csvFile.close()
    print(PROJECTS_FILE, 'saved.', len(projectIds), 'records.')

# gets lines changed in total (added, updated, deleted)
def getStatsTotal(projectId, commitId):
    url = GITLAB_URL + 'projects/' + str(projectId) + '/repository/commits/' + commitId
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        commitInfo = response.json()
        return commitInfo['stats']['total']
        # print(commitInfo)
        # print('Total:', commitInfo['stats']['total'])
    return 0
######################################################################

print("API Key:")
apiKey = input()
HEADERS['PRIVATE-TOKEN'] = apiKey

projectIds = []
if os.path.isfile(PROJECTS_FILE):
    projectIds = readProjectIds()
else:
    projectIds = getProjectIds()
    writeProjectIds(projectIds)

# with open(AUTHOR_NAME + '.csv', 'w', newline='') as csvFile:
print('Projects:', len(projectIds))
counter = 0
for projectId in projectIds:
    counter += 1
    # skip report if created before
    reportFilePath = REPORT_NAME + '-' + projectId + '.csv'
    if os.path.isfile(reportFilePath):
        print(reportFilePath, 'already exists. Skipping...')
        continue

    with open(reportFilePath, 'w', newline='') as csvFile:
        print(counter, 'Project ID', projectId, end='')
        csvWriter = csv.writer(csvFile, delimiter=',', dialect='excel')
        page = 1
        commitsCount = 0
        while True:
            print(".", end='', sep='')
            params = {'since': SCAN_FIRST_DATE, 'per_page': PAGE_SIZE, 'page': page}
            url = GITLAB_URL + 'projects/' + str(projectId) + '/repository/commits'
            response = requests.get(url, params, headers=HEADERS)
            if response.status_code != 200:
                break
            else:
                commits = response.json()
                commitsCount += len(commits)
                for commit in commits:
                    # if commit['author_email'].lower() == AUTHOR_NAME:
                    statsTotal = getStatsTotal(projectId, commit['id'])
                    # csvWriter.writerow([commit['id'], commit['authored_date'], commit['author_name'], commit['author_email'], commit['title'], statsTotal])
                    commitDate = commit['authored_date'][:10]
                    authorName = unicodedata.normalize('NFKD', commit['author_name']).encode('ascii', 'ignore')
                    commitTitle = unicodedata.normalize('NFKD', commit['title']).encode('ascii', 'ignore')

                    try:
                        csvWriter.writerow([commitDate, authorName, commit['author_email'], commitTitle, statsTotal])
                    except Exception as e:
                        print(f"Error writing to CSV for project ID {projectId} with params: {[commitDate, authorName, commit['author_email'], commitTitle, statsTotal]}")
                        print("Exception message:", str(e))
                        sys.exit(1)  # Exit the program with an error status

                if len(commits) < PAGE_SIZE:
                    break
            page += 1
        csvFile.close()
        print('commits:', commitsCount)

# print('Finished with', AUTHOR_NAME + '.csv')
print('Finished with', REPORT_NAME + '.csv')