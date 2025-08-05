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
    Returns set of dates with logged time
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
        
        # Extract dates with logged time
        logged_dates = set()
        if 'results' in data:
            for worklog in data['results']:
                logged_dates.add(worklog.get('startDate', ''))
        
        return logged_dates
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching Tempo worklogs for {employee_account_id}: {e}")
        return set()
    except Exception as e:
        logging.error(f"Unexpected error fetching Tempo worklogs for {employee_account_id}: {e}")
        return set()

def get_bamboo_vacation_days(employee_id: str, start_date: str, end_date: str) -> Set[str]:
    """
    Fetch vacation days from BambooHR for a specific employee
    Returns set of vacation dates
    """
    logging.info(f"Fetching BambooHR vacation data for employee {employee_id}")
    
    bamboo_api_key = os.getenv('BAMBOOHR_API_KEY')
    bamboo_subdomain = os.getenv('BAMBOOHR_SUBDOMAIN')
    
    if not bamboo_api_key or not bamboo_subdomain:
        logging.error("BAMBOOHR_API_KEY or BAMBOOHR_SUBDOMAIN environment variables not set")
        return set()
    
    try:
        url = f"https://{bamboo_subdomain}.bamboohr.com/api/v1/time_off/requests"
        
        # BambooHR uses basic auth with API key as username and 'x' as password
        auth = base64.b64encode(f"{bamboo_api_key}:x".encode()).decode()
        
        headers = {
            'Authorization': f'Basic {auth}',
            'Accept': 'application/json'
        }
        
        params = {
            'start': start_date,
            'end': end_date,
            'employeeId': employee_id,
            'status': 'approved,requested'
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract vacation dates
        vacation_dates = set()
        if isinstance(data, list):
            for request in data:
                if request.get('status', {}).get('status') == 'approved':
                    # Parse date range and add all dates
                    start_dt = datetime.strptime(request['start'], '%Y-%m-%d')
                    end_dt = datetime.strptime(request['end'], '%Y-%m-%d')
                    
                    current = start_dt
                    while current <= end_dt:
                        vacation_dates.add(current.strftime('%Y-%m-%d'))
                        current += timedelta(days=1)
        
        return vacation_dates
        
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching BambooHR vacation data for {employee_id}: {e}")
        return set()
    except Exception as e:
        logging.error(f"Unexpected error fetching BambooHR vacation data for {employee_id}: {e}")
        return set()

def send_slack_notification(slack_user_id: str, employee_name: str, missing_dates: List[str]):
    """Send Slack notification about missing time logs"""
    logging.info(f"Sending Slack notification to {employee_name} ({slack_user_id})")
    
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
        
        send = False
        if send:
            payload = {
                'channel': slack_user_id,
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
    
    # Process each employee
    for employee in employees:
        employee_name = employee['name']
        logging.info(f"Processing employee: {employee_name}")
        
        # Get Tempo worklogs
        tempo_logged_dates = get_tempo_worklogs(
            employee['jiraAccountId'], 
            start_date, 
            end_date
        )
        
        # Get BambooHR vacation days
        vacation_dates = get_bamboo_vacation_days(
            employee['bambooAccountId'],
            start_date,
            end_date
        )
        
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
                employee['slackUserId'],
                employee_name,
                missing_dates
            )
        else:
            logging.info(f"Employee {employee_name} has all time logs complete")
    
    logging.info("Time tracking monitoring completed")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Monitor employee time tracking')
    parser.add_argument('--start-date', required=True, help='Start date (YYYY-MM-DD)')
    parser.add_argument('--end-date', required=True, help='End date (YYYY-MM-DD)')
    parser.add_argument('--teams-file', help='Path to teams.json file (default: ~/teams.json)')
    
    args = parser.parse_args()
    
    monitor_time_tracking(args.start_date, args.end_date, args.teams_file)

if __name__ == "__main__":
    main()