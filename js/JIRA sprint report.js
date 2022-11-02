import 'google-apps-script'; // comment it before pasting to the google scripts
// apps script for google sheet
// scroll down for report code

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

const config = {
  mainSheet: {
    name: 'Main',
    execDateRow: 1,
    execDateCol: 2,
    progressRow: 2,
    progressCol: 2,
    subProgressRow: 2,
    subProgressCol: 3
  },
  settingsSheet: {
    name: 'Settings',
    startDateRow: 1,
    startDateCol: 2,
    configTableRow: 4,
    teamCol: 1,
    boardURLCol: 2,
    typesForCountCol: 3,
    typesForSPCol: 4
  },
  reportSheet: {
    titlesCol: 1,
    sprintsReportedRow: 1,
    sprintsReportedCol: 2,
    // tableFirstRow: 3,
    tableFirstCol: 2,
    sprintRow: 3,
    datesRow: 4,
    dataRow: 5
  }
};

// create custom menu on sheet load
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Piano actions')
      .addItem('Run multi report', 'runMultiReport')
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

function reportSubProgress(progressCell, progressText, color) {
  progressCell.setValue(progressText);
  progressCell.setFontColor(color);
}

// -------------------------------------------------------------------
// multi report code
// scroll down for original report code
function runMultiReport() {
  let mainSheet = SpreadsheetApp.getActive().getSheetByName(config.mainSheet.name);
  mainSheet.activate();
  let progressCell = mainSheet.getRange(config.mainSheet.progressRow, config.mainSheet.progressCol);
  let subProgressCell = mainSheet.getRange(config.mainSheet.subProgressRow, config.mainSheet.subProgressCol);
  reportProgress(progressCell, 'Running', 'black');
  reportSubProgress(subProgressCell, '', 'black');
  SpreadsheetApp.flush();

  // read configuration
  const configSheet = SpreadsheetApp.getActive().getSheetByName(config.settingsSheet.name);
  const minDate = configSheet.getRange(config.settingsSheet.startDateRow, config.settingsSheet.startDateCol).getValue();
  let reports = [];
  let configRow = config.settingsSheet.configTableRow;
  while (true) {
    // team configuration template
    let teamConfig = {
      name: '',
      boardURL: '',
      typesForCount: [],
      typesForSP: []
    };
    // fill team configuration
    teamConfig.name = configSheet.getRange(configRow, config.settingsSheet.teamCol).getValue();
    if (teamConfig.name == '') {
      break;
    }
    teamConfig.boardURL = configSheet.getRange(configRow, config.settingsSheet.boardURLCol).getValue();
    let commaArray = configSheet.getRange(configRow, config.settingsSheet.typesForCountCol).getValue();
    teamConfig.typesForCount = commaArray.split(',');
    commaArray = configSheet.getRange(configRow, config.settingsSheet.typesForSPCol).getValue();
    teamConfig.typesForSP = commaArray.split(',');
    // append configuration to the array
    reports.push(teamConfig);
    configRow++;
  }

  // check connectivity
  if (!pingJira()) {
    reportProgress(progressCell, 'Failed: Refresh JIRA login', 'red');
    return;
  }

  // run report for each team
  for (let i = 0; i < reports.length; i++) {
    // check sheet
    let reportSheet = SpreadsheetApp.getActive().getSheetByName(reports[i].name);
    if (reportSheet == null) {
      reportSheet = initReportSheet(reports[i].name);
      mainSheet.activate();
    }
    reportProgress(progressCell, 'Scanning teams ' + parseInt((i + 1)*100/reports.length) + '%', 'black');
    if (!generateReport(reportSheet, minDate, reports[i], progressCell, subProgressCell)) {
      break;
    }
  }
  // set final status
  reportProgress(progressCell, 'Finished', 'green');
  reportSubProgress(subProgressCell, '', 'black');
}

// create standard titles in an empty report sheet
function initReportSheet(sheetName) {
  let reportSheet = SpreadsheetApp.getActive().insertSheet(sheetName);
  reportSheet.getRange(config.reportSheet.sprintsReportedRow, config.reportSheet.titlesCol)
    .setValue('Sprints reported')
    .setFontWeight('bold');
  reportSheet.getRange(config.reportSheet.sprintRow, config.reportSheet.titlesCol)
    .setValue('Sprint name')
    .setFontWeight('bold');
  reportSheet.getRange(config.reportSheet.datesRow, config.reportSheet.titlesCol)
    .setValue('Sprint dates')
    .setFontWeight('bold');
  reportSheet.autoResizeColumn(config.reportSheet.titlesCol);
  return reportSheet;
}

// generation of the team's report
function generateReport(reportSheet, minDate, teamConfig, progressCell, subProgressCell) {
  const boardId = getBoardId(teamConfig.boardURL);
  if (boardId == -1) {
    reportProgress(progressCell, 'Failed: Bad Board URL for team ' + teamConfig.name, 'red');
    return false;
  }
  // collect processed sprints
  let excludeSprints = [];
  let reportedSprintColIndex = config.reportSheet.sprintsReportedCol;
  while (true) {
    const processedSprintId = reportSheet.getRange(config.reportSheet.sprintsReportedRow, reportedSprintColIndex).getValue();
    if (processedSprintId == '') {
      break;
    }
    reportedSprintColIndex++;
    excludeSprints.push(processedSprintId);
  }
  // collect all sprints for the board
  let sprints = [];
  if (!getSprints(boardId, minDate, excludeSprints, teamConfig, sprints)) {
    return false;
  }
  // fill captions
  let tableColumn = config.reportSheet.tableFirstCol;
  let reportRow = config.reportSheet.dataRow;
  for (let i = 0; i < teamConfig.typesForCount.length; i++) {
    reportSheet.getRange(reportRow++, config.reportSheet.titlesCol)
      .setValue(teamConfig.typesForCount[i] + ' count')
      .setFontWeight('bold');
    reportSheet.getRange(reportRow++, config.reportSheet.titlesCol)
      .setValue(teamConfig.typesForCount[i] + ' completed')
      .setFontWeight('bold');
    reportSheet.getRange(reportRow++, config.reportSheet.titlesCol)
      .setValue(teamConfig.typesForCount[i] + ' %')
      .setFontWeight('bold');
  }
  for (let i = 0; i < teamConfig.typesForSP.length; i++) {
    reportSheet.getRange(reportRow++, config.reportSheet.titlesCol)
      .setValue(teamConfig.typesForSP[i] + ' SP planned')
      .setFontWeight('bold');
    reportSheet.getRange(reportRow++, config.reportSheet.titlesCol)
      .setValue(teamConfig.typesForSP[i] + ' SP completed')
      .setFontWeight('bold');
    reportSheet.getRange(reportRow++, config.reportSheet.titlesCol)
      .setValue(teamConfig.typesForSP[i] + ' SP %')
      .setFontWeight('bold');
  }
  reportSheet.autoResizeColumn(config.reportSheet.titlesCol);
  // TODO: merge old and new captions
  // look for first empty column
  while (reportSheet.getRange(config.reportSheet.dataRow, tableColumn).getValue() != '') {
    tableColumn++;
  }
  // scan all sprints
  for (let sprintIndex = 0; sprintIndex < sprints.length; sprintIndex++) {
    reportSubProgress(subProgressCell, 'Scanning sprints ' + parseInt((sprintIndex + 1)*100/sprints.length) + '%', 'black');
    let sprint = sprints[sprintIndex];
    // write sprint metadata
    reportSheet.getRange(config.reportSheet.sprintRow, tableColumn).setValue(sprint.name);
    reportSheet.getRange(config.reportSheet.datesRow, tableColumn).setValue(sprint.startDate.substring(0, 10) + ' - ' + sprint.endDate.substring(0, 10));
    reportSheet.autoResizeColumn(tableColumn);
    // collect sprint results
    let accumulator = {
      number: {}, // each type inside has {total: 0, completed: 0} structure
      SP: {}      // each type inside has {total: 0, completed: 0} structure
    };
    for (let i = 0; i < teamConfig.typesForCount.length; i++) {
      accumulator.number[teamConfig.typesForCount[i]] = {total: 0, completed: 0};
    }
    for (let i = 0; i < teamConfig.typesForSP.length; i++) {
      accumulator.SP[teamConfig.typesForSP[i]] = {total: 0, completed: 0};
    }
    if (!getSprintResults(boardId, sprint, progressCell, accumulator)) {
      return false;
    }
    // write counters
    reportRow = config.reportSheet.dataRow;
    for (let i = 0; i < teamConfig.typesForCount.length; i++) {
      reportSheet.getRange(reportRow++, tableColumn)
        .setValue(accumulator.number[teamConfig.typesForCount[i]].total)
        .setNumberFormat('0');
      reportSheet.getRange(reportRow++, tableColumn)
        .setValue(accumulator.number[teamConfig.typesForCount[i]].completed)
        .setNumberFormat('0');
      reportSheet.getRange(reportRow++, tableColumn)
        .setFormulaR1C1('=R[-1]C[0]/R[-2]C[0]')
        .setNumberFormat('0.#%');
    }
    for (let i = 0; i < teamConfig.typesForSP.length; i++) {
      reportSheet.getRange(reportRow++, tableColumn)
        .setValue(accumulator.number[teamConfig.typesForSP[i]].total)
        .setNumberFormat('0');
      reportSheet.getRange(reportRow++, tableColumn)
        .setValue(accumulator.number[teamConfig.typesForSP[i]].completed)
        .setNumberFormat('0');
      reportSheet.getRange(reportRow++, tableColumn)
        .setFormulaR1C1('=R[-1]C[0]/R[-2]C[0]')
        .setNumberFormat('0.#%');
    }
    // store processed sprint id
    reportSheet.getRange(config.reportSheet.sprintsReportedRow, reportedSprintColIndex++).setValue(sprint.id);
    SpreadsheetApp.flush();
    tableColumn++;
  }
  return true;
}

// collect sprint results
function getSprintResults(boardId, sprint, progressCell, accumulator /* output */) {
  // get all issues
  let apiURL = '/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=' + boardId + '&sprintId=' + sprint.id;
  let response = fetchJira(apiURL);
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    reportProgress(progressCell, 'Failed: Cannot retrieve issues for sprint ' + sprint.name, 'red');
    return false;
  }
  let jsonResponse = JSON.parse(response.getContentText());
  // accumulate completed items
  let completedIssues = jsonResponse.contents.completedIssues;
  for (let j = 0; j < completedIssues.length; j++) {
    let completedIssue = completedIssues[j];
    let type = completedIssue.typeName;
    if (type in accumulator.number) {
      accumulator.number[type].total++;
      accumulator.number[type].completed++;
    }
    if (type in accumulator.SP) {
      const sp = getIssueSP(completedIssue.key);
      accumulator.SP[type].total += sp;
      accumulator.SP[type].completed += sp;
    }
  }
  // accumlate non-completed items
  let notCompletedIssues = jsonResponse.contents.issuesNotCompletedInCurrentSprint;
  for (let j = 0; j < notCompletedIssues.length; j++) {
    let notCompletedIssue = notCompletedIssues[j];
    let type = notCompletedIssue.typeName;
    if (type in accumulator.number) {
      accumulator.number[type].total++;
    }
    if (type in accumulator.SP) {
      const sp = getIssueSP(notCompletedIssue.key);
      accumulator.SP[type].total += sp;
    }
  }
  return true;
}

// collect sprints of the board
function getSprints(boardId, minDate, excludeSprints, teamConfig, sprints /*output*/) {
  let startAt = 0;
  while (true) {
    let apiURL = '/rest/agile/1.0/board/' + boardId + '/sprint?state=closed&startAt=' + startAt;
    // Logger.log(apiURL);
    let response = fetchJira(apiURL);
    if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
      reportProgress(progressCell, 'Failed: Cannot retrieve sprints for team ' + teamConfig.name, 'red');
      return false;
    }
    let jsonResponse = JSON.parse(response.getContentText());
    let values = jsonResponse.values;
    for (let i = 0; i < values.length; i++) {
      const sprint = values[i];
      const sprintStartDate = new Date(sprint.startDate.substring(0, 10));
      if (sprintStartDate >= minDate) {
        // check excluded sprints
        if (excludeSprints.indexOf(sprint.id) == -1) {
          sprints.push(sprint);
        }
      }
    }
    if (jsonResponse.isLast) {
      break;
    }
    startAt += parseInt(jsonResponse.maxResults);
  }
  sprints.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1); // sort by date asc
  return true;
}

// -------------------------------------------------------------------
// report code
function runReport() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Main-archive');
  sheet.activate();
  let boardCell = sheet.getRange(boardURLRow, boardURLColumn);
  let progressCell = sheet.getRange(progressRow, progressColumn);
  reportProgress(progressCell, 'Running', 'black');

  // read configuration
  const configSheet = SpreadsheetApp.getActive().getSheetByName('Configuration');
  const tableColumn = configSheet.getRange(configValueRow, configTableColumnColumn).getValue();
  const tableRow = configSheet.getRange(configValueRow, configTableRowColumn).getValue();
  sheet.getRange(tableRow, tableColumn, 1000, 1000).clear(); // clean old content before execution
  sheet.getRange(tableRow + 2, tableColumn - 1, 1000, 1)     // clean old content before execution
    .clear()
    .setFontWeight('bold');
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
    configTypesForSP[typesForSP[i]]['completedPercentRow'] = rowIndex++;
    sheet.getRange(configTypesForSP[typesForSP[i]].countRow, 1).setValue(typesForSP[i] + ' SP');
    sheet.getRange(configTypesForSP[typesForSP[i]].completedRow, 1).setValue(typesForSP[i] + ' SP completed');
    sheet.getRange(configTypesForSP[typesForSP[i]].completedPercentRow, 1).setValue(typesForSP[i] + ' SP %');
  }
  let configTypesForCount = {}; // keeps row numbers for each type to report count of issues
  for (let i = 0; i < typesForCount.length; i++) {
    configTypesForCount[typesForCount[i]] = {'countRow': rowIndex++};
    configTypesForCount[typesForCount[i]]['completedRow'] = rowIndex++;
    configTypesForCount[typesForCount[i]]['completedPercentRow'] = rowIndex++;
    sheet.getRange(configTypesForCount[typesForCount[i]].countRow, 1).setValue(typesForCount[i]);
    sheet.getRange(configTypesForCount[typesForCount[i]].completedRow, 1).setValue(typesForCount[i] + ' completed');
    sheet.getRange(configTypesForCount[typesForCount[i]].completedPercentRow, 1).setValue(typesForCount[i] + ' %');
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
      sheet.getRange(configTypesForSP[typesForSP[j]].countRow, tableColumn + i)
        .setValue(counter[typesForSP[j]].SP)
        .setNumberFormat('0');
      sheet.getRange(configTypesForSP[typesForSP[j]].completedRow, tableColumn + i)
        .setValue(counter[typesForSP[j]].completedSP)
        .setNumberFormat('0');
      sheet.getRange(configTypesForSP[typesForSP[j]].completedPercentRow, tableColumn + i)
        .setFormulaR1C1('=R[-1]C[0]/R[-2]C[0]')
        .setNumberFormat('0.#%');
    }
    for (let j = 0; j < typesForCount.length; j++) {
      sheet.getRange(configTypesForCount[typesForCount[j]].countRow, tableColumn + i)
        .setValue(counter[typesForCount[j]].count)
        .setNumberFormat('0');
      sheet.getRange(configTypesForCount[typesForCount[j]].completedRow, tableColumn + i)
        .setValue(counter[typesForCount[j]].completed)
        .setNumberFormat('0');
      sheet.getRange(configTypesForCount[typesForCount[j]].completedPercentRow, tableColumn + i)
        .setFormulaR1C1('=R[-1]C[0]/R[-2]C[0]')
        .setNumberFormat('0.#%');
    }
    // break;
    SpreadsheetApp.flush();
  }

  reportProgress(progressCell, 'Finished', 'green');
}
