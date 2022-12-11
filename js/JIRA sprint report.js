import 'google-apps-script'; // comment it before pasting to the google scripts
// apps script for google sheet
// scroll down for report code

const baseURL = 'https://tinypass.atlassian.net';

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
    tableFirstCol: 2,
    sprintRow: 3,
    datesRow: 4,
    countTotalRow: 5,
    countCompletedRow: 6,
    countPercentRow: 7,
    spTotalRow: 8,
    spCompletedRow: 9,
    spPercentRow: 10,
    dataRow: 11
  }
};

// create custom menu on sheet load
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Piano actions')
      .addItem('Run multi report', 'runMultiReport')
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


// main report class
class MultiReport {
  constructor() {
    this.minDate = null;
    this.mainSheet = SpreadsheetApp.getActive().getSheetByName(config.mainSheet.name);
    this.configSheet = SpreadsheetApp.getActive().getSheetByName(config.settingsSheet.name);
    this.progressCell = this.mainSheet.getRange(config.mainSheet.progressRow, config.mainSheet.progressCol);
    this.subProgressCell = this.mainSheet.getRange(config.mainSheet.subProgressRow, config.mainSheet.subProgressCol);
  }

  reportProgress(progressText, color) {
    this.progressCell.setValue(progressText);
    this.progressCell.setFontColor(color);
  }
  
  reportSubProgress(progressText, color) {
    this.subProgressCell.setValue(progressText);
    this.subProgressCell.setFontColor(color);
  }
  
  init() {
    this.mainSheet.activate();
    this.reportProgress('Running', 'black');
    this.reportSubProgress('', 'black');
    SpreadsheetApp.flush();
    this.minDate = this.configSheet.getRange(config.settingsSheet.startDateRow, config.settingsSheet.startDateCol).getValue();
  }

  finalize() {
    const now = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd hh:mm") + ' GMT';
    this.mainSheet.getRange(config.mainSheet.execDateRow, config.mainSheet.execDateCol).setValue(now);
    // set final status
    this.reportProgress('Finished', 'green');
    this.reportSubProgress('', 'black');
  }

  // parse board URL and get Id from it
  getBoardId(boardURL) {
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

  // read configurations per each team
  getTeamsConfig() {
    let configs = [];
    let configRow = config.settingsSheet.configTableRow;
    while (true) {
      // team configuration template
      let teamConfig = {
        name: '',
        boardId: -1,
        typesForCount: [],
        typesForSP: []
      };
      // fill team configuration
      teamConfig.name = this.configSheet.getRange(configRow, config.settingsSheet.teamCol).getValue();
      if (teamConfig.name == '') {
        break;
      }
      const boardURL = this.configSheet.getRange(configRow, config.settingsSheet.boardURLCol).getValue();
      teamConfig.boardId = this.getBoardId(boardURL);
      let commaArray = this.configSheet.getRange(configRow, config.settingsSheet.typesForCountCol).getValue();
      teamConfig.typesForCount = commaArray.split(',');
      commaArray = this.configSheet.getRange(configRow, config.settingsSheet.typesForSPCol).getValue();
      teamConfig.typesForSP = commaArray.split(',');
      // append configuration to the array
      configs.push(teamConfig);
      configRow++;
    }
    return configs;
  }

  // return sheet of the team, create if need
  getTeamSheet(teamName) {
    let reportSheet = SpreadsheetApp.getActive().getSheetByName(teamName);
    if (reportSheet == null) {
      reportSheet = this.createReportSheet(teamName);
      this.mainSheet.activate();
    }
    return reportSheet;
  }

  // create standard titles in an empty report sheet
  createReportSheet(sheetName) {
    let reportSheet = SpreadsheetApp.getActive().insertSheet(sheetName);
    reportSheet.getRange(config.reportSheet.countTotalRow, config.reportSheet.titlesCol)
      .setValue('Total count')
      .setFontWeight('bold');
    reportSheet.getRange(config.reportSheet.countCompletedRow, config.reportSheet.titlesCol)
      .setValue('Total completed')
      .setFontWeight('bold');
    reportSheet.getRange(config.reportSheet.countPercentRow, config.reportSheet.titlesCol)
      .setValue('Total %')
      .setFontWeight('bold');
    reportSheet.getRange(config.reportSheet.spTotalRow, config.reportSheet.titlesCol)
      .setValue('Total SP planned')
      .setFontWeight('bold');
    reportSheet.getRange(config.reportSheet.spCompletedRow, config.reportSheet.titlesCol)
      .setValue('Total SP completed')
      .setFontWeight('bold');
    reportSheet.getRange(config.reportSheet.spPercentRow, config.reportSheet.titlesCol)
      .setValue('Total SP %')
      .setFontWeight('bold');
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

  // report main func
  generateReport(reportSheet, teamConfig) {
    if (teamConfig.boardId == -1) {
      report.reportProgress('Failed: Bad Board URL for team ' + teamConfig.name, 'red');
      return false;
    }
    let teamReport = new TeamReport(teamConfig, reportSheet, this);
    return teamReport.run(this.minDate);
  }
}


// class for one team report
class TeamReport {
  constructor (teamConfig, reportSheet, report) {
    this.report = report;
    this.teamConfig = teamConfig;
    this.reportSheet = reportSheet;
    this.reportRow = config.reportSheet.dataRow;
    this.sprints = [];
    this.excludeSprints = [];
    // collect processed sprints
    this.reportedSprintColIndex = config.reportSheet.sprintsReportedCol;
    while (true) {
      const processedSprintId = reportSheet.getRange(config.reportSheet.sprintsReportedRow, this.reportedSprintColIndex).getValue();
      if (processedSprintId == '') {
        break;
      }
      this.reportedSprintColIndex++;
      this.excludeSprints.push(processedSprintId);
    }
    // init default captions
    this.initSheet();
  }
  
  // fill table captions
  initSheet() {
    // TODO: merge old and new captions
    for (let i = 0; i < this.teamConfig.typesForCount.length; i++) {
      this.reportSheet.getRange(this.reportRow++, config.reportSheet.titlesCol)
        .setValue(this.teamConfig.typesForCount[i] + ' count')
        .setFontWeight('bold');
      this.reportSheet.getRange(this.reportRow++, config.reportSheet.titlesCol)
        .setValue(this.teamConfig.typesForCount[i] + ' completed')
        .setFontWeight('bold');
      this.reportSheet.getRange(this.reportRow++, config.reportSheet.titlesCol)
        .setValue(this.teamConfig.typesForCount[i] + ' %')
        .setFontWeight('bold');
    }
    for (let i = 0; i < this.teamConfig.typesForSP.length; i++) {
      this.reportSheet.getRange(this.reportRow++, config.reportSheet.titlesCol)
        .setValue(this.teamConfig.typesForSP[i] + ' SP planned')
        .setFontWeight('bold');
      this.reportSheet.getRange(this.reportRow++, config.reportSheet.titlesCol)
        .setValue(this.teamConfig.typesForSP[i] + ' SP completed')
        .setFontWeight('bold');
      this.reportSheet.getRange(this.reportRow++, config.reportSheet.titlesCol)
        .setValue(this.teamConfig.typesForSP[i] + ' SP %')
        .setFontWeight('bold');
    }
    this.reportSheet.autoResizeColumn(config.reportSheet.titlesCol);
  }

  // collect all sprints for the board
  getSprints(minDate) {
    let startAt = 0;
    while (true) {
      let apiURL = '/rest/agile/1.0/board/' + this.teamConfig.boardId + '/sprint?state=closed&startAt=' + startAt;
      // Logger.log(apiURL);
      let response = fetchJira(apiURL);
      if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
        this.report.reportProgress('Failed: Cannot retrieve sprints for team ' + this.teamConfig.name, 'red');
        return false;
      }
      let jsonResponse = JSON.parse(response.getContentText());
      let values = jsonResponse.values;
      for (let i = 0; i < values.length; i++) {
        const sprint = values[i];
        const sprintStartDate = new Date(sprint.startDate.substring(0, 10));
        if (sprintStartDate >= minDate) {
          // check excluded sprints
          if (this.excludeSprints.indexOf(sprint.id) == -1) {
            this.sprints.push(sprint);
          }
        }
      }
      if (jsonResponse.isLast) {
        break;
      }
      startAt += parseInt(jsonResponse.maxResults);
    }
    this.sprints.sort((a, b) => (a.startDate > b.startDate) ? 1 : -1); // sort by date asc
    return true;
  }

  // get assigned story points value for the issue
  getIssueSP(issueKey) {
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

  // get sprint results
  getSprintResults (sprint, accumulator) {
    // set default values
    for (let i = 0; i < this.teamConfig.typesForCount.length; i++) {
      accumulator.number[this.teamConfig.typesForCount[i]] = {total: 0, completed: 0};
    }
    for (let i = 0; i < this.teamConfig.typesForSP.length; i++) {
      accumulator.SP[this.teamConfig.typesForSP[i]] = {total: 0, completed: 0};
    }
    // get all issues
    let apiURL = '/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=' + this.teamConfig.boardId + '&sprintId=' + sprint.id;
    let response = fetchJira(apiURL);
    if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
      this.report.reportProgress('Failed: Cannot retrieve issues for sprint ' + sprint.name, 'red');
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
        const sp = this.getIssueSP(completedIssue.key);
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
        const sp = this.getIssueSP(notCompletedIssue.key);
        accumulator.SP[type].total += sp;
      }
    }
    return true;
  }

  // report main func
  run(minDate) {
    if (!this.getSprints(minDate)) {
      return false;
    }
    // look for first empty column
    let tableColumn = config.reportSheet.tableFirstCol;
    while (this.reportSheet.getRange(config.reportSheet.dataRow, tableColumn).getValue() != '') {
      tableColumn++;
    }
    // scan all sprints
    for (let sprintIndex = 0; sprintIndex < this.sprints.length; sprintIndex++) {
      this.report.reportSubProgress('Scanning sprints ' + parseInt((sprintIndex + 1)*100/this.sprints.length) + '%', 'black');
      let sprint = this.sprints[sprintIndex];
      // write sprint metadata
      this.reportSheet.getRange(config.reportSheet.sprintRow, tableColumn).setValue(sprint.name);
      this.reportSheet.getRange(config.reportSheet.datesRow, tableColumn).setValue(sprint.startDate.substring(0, 10) + ' - ' + sprint.endDate.substring(0, 10));
      this.reportSheet.autoResizeColumn(tableColumn);
      // collect sprint results
      let accumulator = {
        number: {}, // each type inside has {total: 0, completed: 0} structure
        SP: {}      // each type inside has {total: 0, completed: 0} structure
      };
      if (!this.getSprintResults(sprint, accumulator)) {
        return false;
      }
      // write counters
      for (let i = 0; i < this.teamConfig.typesForCount.length; i++) {
        this.reportSheet.getRange(this.reportRow++, tableColumn)
          .setValue(accumulator.number[this.teamConfig.typesForCount[i]].total)
          .setNumberFormat('0');
        this.reportSheet.getRange(this.reportRow++, tableColumn)
          .setValue(accumulator.number[this.teamConfig.typesForCount[i]].completed)
          .setNumberFormat('0');
        this.reportSheet.getRange(this.reportRow++, tableColumn)
          .setFormulaR1C1('=R[-1]C[0]/R[-2]C[0]')
          .setNumberFormat('0.#%');
      }
      for (let i = 0; i < this.teamConfig.typesForSP.length; i++) {
        this.reportSheet.getRange(this.reportRow++, tableColumn)
          .setValue(accumulator.number[this.teamConfig.typesForSP[i]].total)
          .setNumberFormat('0');
        this.reportSheet.getRange(this.reportRow++, tableColumn)
          .setValue(accumulator.number[this.teamConfig.typesForSP[i]].completed)
          .setNumberFormat('0');
        this.reportSheet.getRange(this.reportRow++, tableColumn)
          .setFormulaR1C1('=R[-1]C[0]/R[-2]C[0]')
          .setNumberFormat('0.#%');
      }
      // store processed sprint id
      this.reportSheet.getRange(config.reportSheet.sprintsReportedRow, this.reportedSprintColIndex++).setValue(sprint.id);
      SpreadsheetApp.flush();
      tableColumn++;
    }
    return true;
  }
}


// -------------------------------------------------------------------
// multi report code
function runMultiReport() {
  let report = new MultiReport();
  report.init();

  // check connectivity
  if (!pingJira()) {
    report.reportProgress('Failed: Refresh JIRA login', 'red');
    return;
  }

  // sheet.getRange(tableRow, tableColumn, 1000, 1000).clear(); // clean old content before execution
  // sheet.getRange(tableRow + 2, tableColumn - 1, 1000, 1)     // clean old content before execution
  //   .clear()
  //   .setFontWeight('bold');

  // read configuration
  let configs = report.getTeamsConfig();
  // run report for each team
  for (let i = 0; i < configs.length; i++) {
    report.reportProgress('Scanning teams ' + parseInt((i + 1)*100/configs.length) + '%', 'black');
    let reportSheet = report.getTeamSheet(configs[i].name);
    if (report.generateReport(reportSheet, configs[i])) {
      break;
    }
  }
  report.finalize();
}
