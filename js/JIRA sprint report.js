const baseURL = 'https://tinypass.atlassian.net';
const boardURLRow = 1;
const boardURLColumn = 2;
const progressRow = 2;
const progressColumn = 2;
const minDateRow = 3;
const minDateColumn = 2;

const configValueRow = 2;
const configTypesCountColumn = 1;
const configTypesSPColumn = 2;
const configTableColumnColumn = 3;
const configTableRowColumn = 4;

// create custom menu on sheet load
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Piano actions')
      .addItem('Run report', 'runReport')
      .addItem('Refresh JIRA login', 'requestAccessString')
      .addToUi();
}

// inputs for updating JIRA token
function requestAccessString() {
  const email = SpreadsheetApp.getUi().prompt('Enter your JIRA login email').getResponseText();
  const apiToken = SpreadsheetApp.getUi().prompt('Enter your JIRA API token').getResponseText();
  const loginString = email + ':' + apiToken;
  const accessString = Utilities.base64Encode(loginString);
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('jiraAccessString', accessString);
}

function getAccessString() {
  const userProperties = PropertiesService.getUserProperties();
  const accessString = userProperties.getProperty('jiraAccessString');
  return accessString;
}

// API wrapper
function fetchJira(api, muteHttpExceptions = false) {
  const headers = {
    'content-type': 'application/json',
    'authorization': 'Basic ' + getAccessString()
  };
  const params = {
    'headers': headers,
    muteHttpExceptions: muteHttpExceptions
  };
  const apiURL = baseURL + api;
  return UrlFetchApp.fetch(apiURL, params);
}

// check if JIRA accessible
function pingJira() {
  const response = fetchJira('/rest/api/2/configuration', true);
  let result = false;
  if (response.getResponseCode() >= 200 && response.getResponseCode() < 300) {
    result = true;
  }
  return result;
}

// parse board URL and get Id from it
function getBoardId(boardURL) {
  let leftIndex = boardURL.indexOf('/boards/');
  if (leftIndex == -1) {
    return -1;
  }
  leftIndex += 8;
  let boardId = boardURL.substring(leftIndex);
  let rightIndex = boardId.indexOf('?');
  if (rightIndex != -1) {
    boardId = boardId.substring(0, rightIndex);
  }
  rightIndex = boardId.indexOf('/');
  if (rightIndex != -1) {
    boardId = boardId.substring(0, rightIndex);
  }
  return boardId;
}

// get assigned story points value for the issue
function getIssueSP(issueKey) {
  let apiURL = '/rest/agile/1.0/issue/' + issueKey + '?fields=customfield_10004';
  let response = fetchJira(apiURL);
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    return 0;
  }
  let jsonResponse = JSON.parse(response.getContentText());
  let sp = parseInt(jsonResponse.fields.customfield_10004);
  if (isNaN(sp)) {
    sp = 0;
  }
  return sp;
}

function reportProgress(progressCell, progressText, color) {
  progressCell.setValue(progressText);
  progressCell.setFontColor(color);
}

// -------------------------------------------------------------------
// report code
function runReport() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Main');
  let boardCell = sheet.getRange(boardURLRow, boardURLColumn);
  let progressCell = sheet.getRange(progressRow, progressColumn);
  reportProgress(progressCell, 'Running', 'black');

  // read configuration
  const configSheet = SpreadsheetApp.getActive().getSheetByName('Configuration');
  const tableColumn = configSheet.getRange(configValueRow, configTableColumnColumn).getValue();
  const tableRow = configSheet.getRange(configValueRow, configTableRowColumn).getValue();
  sheet.getRange(tableRow, tableColumn, 1000, 1000).clear(); // clean old content before execution
  let typesForCount = [];
  let i = 0;
  while (true) {
    let typeForCount = configSheet.getRange(configValueRow + i, configTypesCountColumn).getValue().toString();
    if (typeForCount == '') {
      break;
    }
    typesForCount.push(typeForCount);
    i++;
  }
  if (typesForCount.length == 0) {
    reportProgress(progressCell, 'Failed: No types for count', 'red');
    return;
  }
  let typesForSP = [];
  i = 0;
  while (true) {
    let typeForSP = configSheet.getRange(configValueRow + i, configTypesSPColumn).getValue().toString();
    if (typeForSP == '') {
      break;
    }
    typesForSP.push(typeForSP);
    i++;
  }
  if (typesForSP.length == 0) {
    reportProgress(progressCell, 'Failed: No types for SP', 'red');
    return;
  }
  // define configured rows
  let rowIndex = tableRow;
  const sprintsRow = rowIndex++;
  const sprintDatesRow = rowIndex++;
  let configTypesForSP = {}; // keeps row numbers for each type to report SP
  for (let i = 0; i < typesForSP.length; i++) {
    configTypesForSP[typesForSP[i]] = {'countRow': rowIndex++};
    configTypesForSP[typesForSP[i]]['completedRow'] = rowIndex++;
    sheet.getRange(configTypesForSP[typesForSP[i]].countRow, 1).setValue(typesForSP[i] + ' SP');
    sheet.getRange(configTypesForSP[typesForSP[i]].completedRow, 1).setValue(typesForSP[i] + ' SP completed');
  }
  let configTypesForCount = {}; // keeps row numbers for each type to report count of issues
  for (let i = 0; i < typesForCount.length; i++) {
    configTypesForCount[typesForCount[i]] = {'countRow': rowIndex++};
    configTypesForCount[typesForCount[i]]['completedRow'] = rowIndex++;
    sheet.getRange(configTypesForCount[typesForCount[i]].countRow, 1).setValue(typesForCount[i]);
    sheet.getRange(configTypesForCount[typesForCount[i]].completedRow, 1).setValue(typesForCount[i] + ' completed');
  }

  // check connectivity
  if (!pingJira()) {
    reportProgress(progressCell, 'Failed: Refresh JIRA login', 'red');
    return;
  }
  const boardURL = boardCell.getValue().toString();
  if (boardURL == '') {
    reportProgress(progressCell, 'Failed: Board URL is empty', 'red');
    return;
  }
  const boardId = getBoardId(boardURL);
  if (boardId == -1) {
    reportProgress(progressCell, 'Failed: Bad Board URL', 'red');
    return;
  }

  // collect all sprints for the board
  const minDate = sheet.getRange(minDateRow, minDateColumn).getValue();
  let sprints = [];
  let startAt = 0;
  while (true) {
    let apiURL = '/rest/agile/1.0/board/' + boardId + '/sprint?state=closed&startAt=' + startAt;
    // Logger.log(apiURL);
    let response = fetchJira(apiURL);
    if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
      reportProgress(progressCell, 'Failed: Cannot retrieve sprints from board', 'red');
      return;
    }
    let jsonResponse = JSON.parse(response.getContentText());
    let values = jsonResponse.values;
    for (let i = 0; i < values.length; i++) {
      const sprintStartDate = new Date(values[i].startDate.substring(0, 10));
      if (sprintStartDate >= minDate) {
        sprints.push(values[i]);
      }
    }
    if (jsonResponse.isLast) {
      break;
    }
    startAt += parseInt(jsonResponse.maxResults);
  }
  sprints.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1); // sort by date asc
  // sprints.sort((a, b) => (a.startDate > b.startDate) ? -1 : 1); // sort by date desc
  for (let i = 0; i < sprints.length; i++) {
    reportProgress(progressCell, 'Scanning sprints ' + parseInt((i + 1)*100/sprints.length) + '%', 'black');
    let sprint = sprints[i];
    sheet.getRange(sprintsRow, tableColumn + i).setValue(sprint.name);
    sheet.getRange(sprintDatesRow, tableColumn + i).setValue(sprint.startDate.substring(0, 10) + ' - ' + sprint.endDate.substring(0, 10));
    sheet.autoResizeColumn(tableColumn + i);

    // reset counters
    let counter = {};
    for (let j = 0; j < typesForSP.length; j++) {
      counter[typesForSP[j]] = {'count': 0, 'completed': 0, 'SP': 0, 'completedSP': 0};
    }
    for (let j = 0; j < typesForCount.length; j++) {
      counter[typesForCount[j]] = {'count': 0, 'completed': 0, 'SP': 0, 'completedSP': 0};
    }
    // get all issues
    let apiURL = '/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=' + boardId + '&sprintId=' + sprint.id;
    let response = fetchJira(apiURL);
    if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
      reportProgress(progressCell, 'Failed: Cannot retrieve issues for sprint ' + sprint.name, 'red');
      return;
    }
    let jsonResponse = JSON.parse(response.getContentText());
    let completedIssues = jsonResponse.contents.completedIssues;
    for (let j = 0; j < completedIssues.length; j++) {
      let completedIssue = completedIssues[j];
      let type = completedIssue.typeName;
      if (typesForCount.includes(type)) {
        counter[type].count++;
        counter[type].completed++;
      }
      if (typesForSP.includes(type)) {
        const sp = getIssueSP(completedIssue.key);
        counter[type].completedSP += sp;
        counter[type].SP += sp;
      }
    }
    let notCompletedIssues = jsonResponse.contents.issuesNotCompletedInCurrentSprint;
    for (let j = 0; j < notCompletedIssues.length; j++) {
      let notCompletedIssue = notCompletedIssues[j];
      let type = notCompletedIssue.typeName;
      if (typesForCount.includes(type)) {
        counter[type].count++;
      }
      if (typesForSP.includes(type)) {
        const sp = getIssueSP(notCompletedIssue.key);
        counter[type].SP += sp;
      }
    }

    // write counters
    for (let j = 0; j < typesForSP.length; j++) {
      sheet.getRange(configTypesForSP[typesForSP[j]].countRow, tableColumn + i).setValue(counter[typesForSP[j]].SP);
      sheet.getRange(configTypesForSP[typesForSP[j]].completedRow, tableColumn + i).setValue(counter[typesForSP[j]].completedSP);
    }
    for (let j = 0; j < typesForCount.length; j++) {
      sheet.getRange(configTypesForCount[typesForCount[j]].countRow, tableColumn + i).setValue(counter[typesForCount[j]].count);
      sheet.getRange(configTypesForCount[typesForCount[j]].completedRow, tableColumn + i).setValue(counter[typesForCount[j]].completed);
    }
    // break;
    SpreadsheetApp.flush();
  }

  reportProgress(progressCell, 'Finished', 'green');
}