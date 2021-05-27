import requests

def checkGoogleDoc(docIds, content, idx, docType):
    gDocURL = 'https://docs.google.com/' + docType + '/d/'
    if content.find(gDocURL, idx) != -1:
        docEnd = content.find('/', idx + len(gDocURL))
        if docEnd == -1:
            print(content[idx:100])
        else:
            docId = content[idx + len(gDocURL):docEnd]
            if docId not in docIds:
                docIds.add(docId)
                docURL = content[idx:docEnd]
                print(docURL)

def parsePageContent(docIds, content):
    idx = 0
    while idx != -1:
        idx = content.find('https://docs.google.com/', idx + 1)
        if idx != -1:
            checkGoogleDoc(docIds, content, idx, 'spreadsheets')
            checkGoogleDoc(docIds, content, idx, 'document')
            checkGoogleDoc(docIds, content, idx, 'presentation')

def parsePage(docIds, pageIds, pageId, headers):
    if pageId not in pageIds:
        pageIds.add(pageId)
        url = 'https://kb.akbars.ru/rest/api/content/' + pageId + '?expand=body.view'
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            content = response.json()['body']['view']['value']
            parsePageContent(docIds, content)
            url = 'https://kb.akbars.ru/rest/api/content/' + pageId + '/child/page'
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                children = response.json()['results']
                for child in children:
                    parsePage(docIds, pageIds, child['id'], headers)

def searchGoogleDocs(sessionID, headers):
    url = 'https://kb.akbars.ru/rest/api/space?limit=1000'
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        pageIds = set()
        docIds = set()
        spaces = response.json()['results']
        # spaces = [{'key': 'ABDTDIT'}]
        for space in spaces:
            spaceKey = space['key']
            if spaceKey != '':
                print('>>> Scan space ' + spaceKey)
                url = 'https://kb.akbars.ru/rest/api/space/' + spaceKey + '/content'
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    pages = response.json()['page']['results']
                    for page in pages:
                        parsePage(docIds, pageIds, page['id'], headers)

sessionID = 'C1DF17EBA2BF20F7CF6FE62D841EF7E9'
headers = {'Accept': 'application/json', 'Cookie': 'JSESSIONID=' + sessionID}

searchGoogleDocs(sessionID, headers)