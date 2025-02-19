import requests
import csv
from datetime import datetime

# params
print("API Key:")
API_TOKEN = input()

print("TeamCity URL:")
TEAMCITY_URL = input()
domain_start = TEAMCITY_URL.find("://") + 3  # Find the start of the domain after "://"
domain_end = TEAMCITY_URL.find("/", domain_start)  # Find the end of the domain which is the next "/"
if domain_end == -1:  # If no "/" is found, take the rest of the string as domain
    domain_end = len(TEAMCITY_URL)
DOMAIN = TEAMCITY_URL[domain_start:domain_end]  # Extract the domain

OUTPUT_FILE = f"teamcity_{DOMAIN}_audit_logs.csv"
START_DATE = datetime(2024, 8, 26)

HEADERS = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Accept": "application/json"
}

# process
start = 0
count = 100
with open(OUTPUT_FILE, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["date", "user", "action"])
    while True:
        print("Getting from", start)
        API_ENDPOINT = f"{TEAMCITY_URL}/app/rest/audit?locator=count:{count},start:{start}"
        response = requests.get(API_ENDPOINT, headers=HEADERS)

        if response.status_code == 200:
            data = response.json()
            audit_entries = data.get("auditEvent", [])

            if not audit_entries:
                break

            for entry in audit_entries:
                date_str = entry.get("timestamp", "")
                try:
                    event_date = datetime.strptime(date_str, "%Y%m%dT%H%M%S%z")
                except ValueError:
                    continue  # skip wrong dates

                if event_date.date() >= START_DATE.date():
                    date = entry.get("timestamp", "N/A")
                    user = entry.get("user", {}).get("username", "N/A")
                    action = entry.get("action", {}).get("name", "N/A")

                    writer.writerow([date, user, action])

            start += count
        else:
            print(f"Error: {response.status_code} - {response.text}")
            break

print(f"Logs saved {OUTPUT_FILE}")