#!/usr/bin/env python3
"""
Time Tracking Monitor Script

This script monitors employee time logging by:
1. Loading employee data from teams.json
2. Fetching time logs from Tempo API
3. Checking vacation status from BambooHR
4. Sending Slack notifications for missing time logs on work days
"""

import json
import os
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Set
import argparse
import logging
import requests
from urllib.parse import urljoin
import base64

def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('time_tracking_monitor.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )

def load_teams_data(file_path: str) -> Dict:
    """Load employee data from teams.json file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        logging.error(f"Teams file not found: {file_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logging.error(f"Invalid JSON in teams file: {e}")
        sys.exit(1)

def get_all_employees(teams_data: Dict) -> List[Dict]:
    """Extract all employees from teams data"""
    employees = []
    for team_name, team_members in teams_data.items():
        if team_name != 'Templates' and team_name != 'Reports-1':
            for member in team_members:
                member['team'] = team_name
                employees.append(member)
    return employees

def is_workday(date: datetime) -> bool:
    """Check if a date is a workday (Monday-Friday)"""
    return date.weekday() < 5

def get_date_range(start_date: str, end_date: str) -> List[datetime]:
    """Generate list of dates in the given range"""
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    
    dates = []
    current = start
    while current <= end:
        dates.append(current)
        current += timedelta(days=1)
    
    return dates

def get_tempo_worklogs(employee_account_id: str, start_date: str, end_date: str) -> Set[str]:
    """
    Fetch worklogs from Tempo API for a specific employee
    Returns set of dates with logged time more than 3 hours
    """
    logging.info(f"Fetching Tempo worklogs for employee {employee_account_id}")
    
    tempo_token = os.getenv('TEMPO_API_TOKEN')
    if not tempo_token:
        logging.error("TEMPO_API_TOKEN environment variable not set")
        return set()
    
    try:
        url = "https://api.tempo.io/4/worklogs/user/" + employee_account_id
        headers = {
            'Authorization': f'Bearer {tempo_token}',
            'Content-Type': 'application/json'
        }
        
        params = {
            # 'worker': employee_account_id,
            'from': start_date,
            'to': end_date
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract dates with logged time less than 3 hours
        date_time_dict = {}
        if 'results' in data:
            for worklog in data['results']:
                date = worklog.get('startDate', '')
                time_seconds = worklog.get('timeSpentSeconds', 0)
                
                if date:
                    if date not in date_time_dict:
                        date_time_dict[date] = 0
                    date_time_dict[date] += time_seconds
        
        # Return only dates with more than 3 hours (10800 seconds) logged
        logged_dates = set()
        for date, total_seconds in date_time_dict.items():
            if total_seconds > 3*60*60:
                logged_dates.add(date)
        
        return logged_dates
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching Tempo worklogs for {employee_account_id}: {e}")
        return set()
    except Exception as e:
        logging.error(f"Unexpected error fetching Tempo worklogs for {employee_account_id}: {e}")
        return set()

def get_all_bamboo_vacation_days(start_date: str, end_date: str) -> Dict[str, Set[str]]:
    """
    Fetch vacation days from BambooHR for all employees using the "who's out" API
    Returns dictionary with employee_id as key and set of vacation dates as value
    """
    logging.info("Fetching BambooHR vacation data for all employees")
    
    bamboo_api_key = os.getenv('BAMBOOHR_API_KEY')
    bamboo_subdomain = os.getenv('BAMBOOHR_SUBDOMAIN')
    
    if not bamboo_api_key or not bamboo_subdomain:
        logging.error("BAMBOOHR_API_KEY or BAMBOOHR_SUBDOMAIN environment variables not set")
        return {}
    
    try:
        url = f"https://{bamboo_subdomain}.bamboohr.com/api/v1/time_off/whos_out"
        
        # BambooHR uses basic auth with API key as username and 'x' as password
        auth = base64.b64encode(f"{bamboo_api_key}:x".encode()).decode()
        
        headers = {
            'Authorization': f'Basic {auth}',
            'Accept': 'application/json'
        }
        
        params = {
            'start': start_date,
            'end': end_date
        }

        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract vacation dates for all employees
        all_vacation_data = {}
        
        # The API returns a list of entries for all employees who are out
        for entry in data:
            employee_id = str(entry.get('employeeId', ''))
            if employee_id:
                if employee_id not in all_vacation_data:
                    all_vacation_data[employee_id] = set()
                    
                entry_start = entry.get('start', '')
                entry_end = entry.get('end', '')
                
                if entry_start and entry_end:
                    # Parse date range and add all dates
                    start_dt = datetime.strptime(entry_start, '%Y-%m-%d')
                    end_dt = datetime.strptime(entry_end, '%Y-%m-%d')
                    
                    current = start_dt
                    while current <= end_dt:
                        all_vacation_data[employee_id].add(current.strftime('%Y-%m-%d'))
                        current += timedelta(days=1)
        
        return all_vacation_data
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching BambooHR vacation data: {e}")
        return {}
    except Exception as e:
        logging.error(f"Unexpected error fetching BambooHR vacation data: {e}")
        return {}

def send_slack_notification(slack_channel_id: str, lang: str, employee_name: str, missing_dates: List[str]):
    """Send Slack notification about missing time logs"""
    logging.info(f"Sending Slack notification to {employee_name} ({slack_channel_id})")
    
    slack_token = os.getenv('SLACK_BOT_TOKEN')
    if not slack_token:
        logging.error("SLACK_BOT_TOKEN environment variable not set")
        return
    
    try:
        url = "https://slack.com/api/chat.postMessage"
        
        headers = {
            'Authorization': f'Bearer {slack_token}',
            'Content-Type': 'application/json'
        }
        
        # Format missing dates
        dates_text = ", ".join(missing_dates)
        
        message = f"Привет! Обнаружены пропущенные записи времени на следующие рабочие дни: {dates_text}. Пожалуйста, заполни время в Tempo."
        if (lang != "ru"):
            message = f"Hi! There are missing worklogs for the days: {dates_text}. Please, log time in Tempo."
        
        payload = {
            'channel': slack_channel_id,
            'text': message
        }
        
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('ok'):
            logging.info(f"Slack notification sent successfully to {employee_name}")
        else:
            logging.error(f"Failed to send Slack notification to {employee_name}: {data.get('error', 'Unknown error')}")
            
    except requests.exceptions.RequestException as e:
        logging.error(f"Error sending Slack notification to {employee_name}: {e}")
    except Exception as e:
        logging.error(f"Unexpected error sending Slack notification to {employee_name}: {e}")

def check_environment_variables():
    """Check if required environment variables are set"""
    required_vars = [
        'TEMPO_API_TOKEN',
        'BAMBOOHR_API_KEY', 
        'BAMBOOHR_SUBDOMAIN',
        'SLACK_BOT_TOKEN'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logging.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        print("Please set the following environment variables:")
        for var in missing_vars:
            print(f"  export {var}=<your_token>")
        sys.exit(1)

def monitor_time_tracking(start_date: str, end_date: str, teams_file: str = None):
    """Main function to monitor time tracking"""
    
    # Setup logging
    setup_logging()
    logging.info(f"Starting time tracking monitoring for period {start_date} to {end_date}")
    
    # Check environment variables
    check_environment_variables()
    
    # Load teams data
    if teams_file is None:
        teams_file = os.path.expanduser("~/teams.json")
    
    teams_data = load_teams_data(teams_file)
    employees = get_all_employees(teams_data)
    
    logging.info(f"Loaded {len(employees)} employees from {len(teams_data)} teams")
    
    # Get date range
    date_range = get_date_range(start_date, end_date)
    workdays = [d for d in date_range if is_workday(d)]
    
    logging.info(f"Checking {len(workdays)} workdays in the specified period")
    
    # Get vacation data for all employees once
    all_vacation_data = get_all_bamboo_vacation_days(start_date, end_date)
    
    # Process each employee
    employees_informed = []
    for employee in employees:
        employee_name = employee['name']
        logging.info(f"Processing employee: {employee_name}")
        
        # Get Tempo worklogs
        tempo_logged_dates = get_tempo_worklogs(
            employee['jiraAccountId'], 
            start_date, 
            end_date
        )
        
        # Get BambooHR vacation days from cached data
        bamboo_employee_id = employee['bambooAccountId']
        vacation_dates = all_vacation_data.get(bamboo_employee_id, set())
        
        # Check for missing time logs on workdays
        missing_dates = []
        for workday in workdays:
            workday_str = workday.strftime('%Y-%m-%d')
            
            # Skip if employee was on vacation
            if workday_str in vacation_dates:
                continue
                
            # Check if time was logged
            if workday_str not in tempo_logged_dates:
                missing_dates.append(workday_str)
        
        # Send notification if there are missing dates
        if missing_dates:
            logging.warning(f"Employee {employee_name} has {len(missing_dates)} missing time logs")
            send_slack_notification(
                employee['slackChannelId'],
                employee['lang'],
                employee_name,
                missing_dates
            )
            employees_informed.append(employee_name)
        else:
            logging.info(f"Employee {employee_name} has all time logs complete")
    
    # Display summary of employees who were informed
    if employees_informed:
        logging.info(f"Employees who were informed about missing time logs: {', '.join(employees_informed)}")
    else:
        logging.info("All employees have logged their time properly!")
    
    logging.info("Time tracking monitoring completed")

def main():
    """Main entry point"""
    # parser = argparse.ArgumentParser(description='Monitor employee time tracking')
    # parser.add_argument('--start-date', required=True, help='Start date (YYYY-MM-DD)')
    # parser.add_argument('--end-date', required=True, help='End date (YYYY-MM-DD)')
    # parser.add_argument('--teams-file', help='Path to teams.json file (default: ~/teams.json)')
    
    # args = parser.parse_args()
    
    # monitor_time_tracking(args.start_date, args.end_date, args.teams_file)
    monitor_time_tracking("2025-08-07", "2025-08-21", "C:\\repos\\teams.json")

if __name__ == "__main__":
    main()