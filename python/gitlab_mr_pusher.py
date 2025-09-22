import requests
import csv
import os
import sys
import json

HEADERS = {'Accept': 'application/json', 'Content-Type': 'application/json', 'PRIVATE-TOKEN': 'token'}
GITLAB_URL = 'https://gitlab.com/api/v4/'
PAGE_SIZE = 100
PROJECTS_FILE = 'projectIds.csv'
TEAMS_FILE = 'C:/repos/teams.json'


def get_project_ids():
    page = 1
    project_ids = []
    while True:
        params = {'visibility': 'private', 'order_by': 'id', 'per_page': PAGE_SIZE, 'page': page}
        url = GITLAB_URL + 'projects'
        response = requests.get(url, params, headers=HEADERS)
        if response.status_code != 200:
            break
        page += 1
        projects = response.json()
        for project in projects:
            project_ids.append(project['id'])
        if len(projects) < PAGE_SIZE:
            break
    return project_ids


def read_project_ids():
    project_ids = []
    with open(PROJECTS_FILE, 'r', newline='') as csvFile:
        csvReader = csv.reader(csvFile, delimiter=',', dialect='excel')
        for projectId in csvReader:
            project_ids.append(projectId[0])
        csvFile.close()
    return project_ids


def write_project_ids(project_ids):
    with open(PROJECTS_FILE, 'w', newline='') as csvFile:
        csvWriter = csv.writer(csvFile, delimiter=',', dialect='excel')
        for projectId in project_ids:
            csvWriter.writerow([projectId])
        csvFile.close()


def load_allowed_author_ids():
    with open(TEAMS_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    ids = set()
    for members in data.values():
        if isinstance(members, list):
            for m in members:
                gid = m.get('gitlabAccountId')
                if gid is None:
                    continue
                try:
                    ids.add(int(gid))
                except Exception:
                    try:
                        ids.add(int(str(gid)))
                    except Exception:
                        pass
    return ids


def list_open_merge_requests(project_id):
    page = 1
    mrs = []
    while True:
        params = {'state': 'opened', 'per_page': PAGE_SIZE, 'page': page}
        url = GITLAB_URL + 'projects/' + str(project_id) + '/merge_requests'
        response = requests.get(url, params, headers=HEADERS)
        if response.status_code != 200:
            break
        page += 1
        part = response.json()
        mrs.extend(part)
        if len(part) < PAGE_SIZE:
            break
    return mrs


def get_mr_details(project_id, mr_iid):
    url = GITLAB_URL + 'projects/' + str(project_id) + '/merge_requests/' + str(mr_iid)
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        return {}
    return response.json()


def get_mr_approvals(project_id, mr_iid):
    url = GITLAB_URL + 'projects/' + str(project_id) + '/merge_requests/' + str(mr_iid) + '/approvals'
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        return {}
    return response.json()


def get_mr_approval_state(project_id, mr_iid):
    url = GITLAB_URL + 'projects/' + str(project_id) + '/merge_requests/' + str(mr_iid) + '/approval_state'
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        return {}
    return response.json()


def normalize_user(u):
    if not u:
        return None
    if 'user' in u and isinstance(u['user'], dict):
        uu = u['user']
    else:
        uu = u
    return {'id': uu.get('id'), 'name': uu.get('name'), 'username': uu.get('username')}


def diff_missing(eligible, approved):
    eligible_ids = set([e['id'] for e in eligible if e and e.get('id') is not None])
    approved_ids = set([a['id'] for a in approved if a and a.get('id') is not None])
    missing_ids = eligible_ids - approved_ids
    missing_map = {e['id']: e for e in eligible if e and e.get('id') in missing_ids}
    return list(missing_map.values())


def compute_missing_reviewers(project_id, mr, approvals):
    approved_by_raw = approvals.get('approved_by') or []
    approved_by = [normalize_user(x) for x in approved_by_raw]
    reviewers = mr.get('reviewers') or []
    reviewers_norm = [normalize_user(x) for x in reviewers]
    if reviewers_norm:
        return diff_missing(reviewers_norm, approved_by)
    approvers_raw = approvals.get('approvers') or []
    approvers_norm = [normalize_user(x) for x in approvers_raw]
    if approvers_norm:
        return diff_missing(approvers_norm, approved_by)
    state = get_mr_approval_state(project_id, mr['iid'])
    rules = state.get('rules') or []
    eligible = []
    for r in rules:
        req = r.get('approvals_required') or 0
        if req > 0:
            elig = r.get('eligible_approvers') or []
            for u in elig:
                nu = normalize_user(u)
                if nu and nu.get('id') is not None:
                    eligible.append(nu)
    if eligible:
        return diff_missing(eligible, approved_by)
    return []


def main():
    apiKey = os.environ.get('GITLAB_PERSONAL_ACCESS_TOKEN', '').strip()
    if not apiKey:
        sys.exit(1)
    HEADERS['PRIVATE-TOKEN'] = apiKey
    if not os.path.isfile(TEAMS_FILE):
        sys.exit(1)
    allowed_author_ids = load_allowed_author_ids()
    if os.path.isfile(PROJECTS_FILE):
        project_ids = read_project_ids()
    else:
        project_ids = get_project_ids()
        write_project_ids(project_ids)
    total_found = 0
    for project_id in project_ids:
        mrs = list_open_merge_requests(project_id)
        for mr in mrs:
            author = mr.get('author') or {}
            aid = author.get('id')
            try:
                aid_int = int(aid) if aid is not None else None
            except Exception:
                aid_int = None
            if aid_int is None or aid_int not in allowed_author_ids:
                continue
            approvals = get_mr_approvals(project_id, mr['iid'])
            if not approvals:
                continue
            approvals_left = approvals.get('approvals_left')
            if approvals_left is None:
                continue
            if approvals_left > 0:
                total_found += 1
                missing = compute_missing_reviewers(project_id, mr, approvals)
                title = mr.get('title') or ''
                iid = mr.get('iid')
                web_url = mr.get('web_url') or ''
                author = mr.get('author') or {}
                author_name = author.get('name') or ''
                author_username = author.get('username') or ''
                print('Project', project_id, 'MR !' + str(iid), title)
                print('Author:', author_username, author_name)
                print('Approvals left:', approvals_left, web_url)
                if missing:
                    for u in missing:
                        print('Waiting:', u.get('username'), u.get('name'))
                else:
                    print('Waiting: not determined')
    if total_found == 0:
        print('No MRs awaiting approvals found')


if __name__ == '__main__':
    main()
