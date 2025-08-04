#!/usr/bin/env python3
import csv
import requests
import os

# You'll need to set your Slack token as an environment variable
# export SLACK_TOKEN='your-slack-token-here'

def fetch_all_slack_users():
    """Fetch all Slack users using pagination"""
    token = os.environ.get('SLACK_TOKEN')
    if not token:
        print("Please set SLACK_TOKEN:")
        token = input()
        # raise ValueError("Please set SLACK_TOKEN environment variable")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    all_users = []
    cursor = None
    
    while True:
        # Prepare request parameters
        params = {
            'limit': 200  # Maximum allowed by Slack API
        }
        if cursor:
            params['cursor'] = cursor
        
        # Make API request
        response = requests.get(
            'https://slack.com/api/users.list',
            headers=headers,
            params=params
        )
        
        data = response.json()
        
        if not data.get('ok'):
            raise Exception(f"Slack API error: {data.get('error', 'Unknown error')}")
        
        # Add users from this page
        users = data.get('members', [])
        all_users.extend(users)
        
        # Check if there are more pages
        cursor = data.get('response_metadata', {}).get('next_cursor')
        if not cursor:
            break
    
    return all_users

def save_users_to_csv(users, filename='slack_users.csv'):
    """Save users to CSV file with id and name columns"""
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header
        writer.writerow(['идентификатор', 'имя'])
        
        # Write user data
        for user in users:
            user_id = user.get('id', '')
            # Use real_name if available, otherwise fall back to name
            user_name = user.get('real_name') or user.get('name', '')
            writer.writerow([user_id, user_name])
    
    print(f"Successfully saved {len(users)} users to {filename}")

def main():
    try:
        print("Fetching Slack users...")
        users = fetch_all_slack_users()
        
        # Filter out deleted users if needed
        active_users = [u for u in users if not u.get('deleted', False)]
        
        print(f"Found {len(users)} total users ({len(active_users)} active)")
        
        save_users_to_csv(users)
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())