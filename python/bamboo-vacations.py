import requests
from datetime import datetime
import base64


print("API Key:")
apiKey = input()

# print("Company subdomain:")
# company = input()
company = "piano"

# Basic configuration
base_url = f"https://api.bamboohr.com/api/gateway.php/{company}/v1"

# Encode API key in base64 for Basic authorization
encoded_key = base64.b64encode(f"{apiKey}:x".encode()).decode()

headers = {
    "Accept": "application/json",
    "Authorization": f"Basic {encoded_key}"
}

def get_whos_out(date_from, date_to):
    """Gets list of employees who are out on the specified date"""
    try:
        # response = requests.get(
        #     f"{base_url}/meta/lists",
        #     headers=headers
        #     # params={"start": date_from, "end": date_to, "location": "all"}
        # )
        # response.raise_for_status()
        # print(response.json())
        response = requests.get(
            f"{base_url}/time_off/whos_out",
            headers=headers,
            params={"start": date_from, "end": date_to, "option": "all"}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting list of absent employees: {e}")
        return None

def main():
    """Main function to get employees on vacation today"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    print(f"Checking absent employees for {today}...")
    whos_out_data = get_whos_out(today, today)
    if whos_out_data:
        print(f"Found absent employees via whos_out API: {len(whos_out_data)}")
        print("\n--- Employees on vacation today ---")
        for employee in whos_out_data:
            name = employee.get('name', 'Unknown')
            start_date = employee.get('start', 'N/A')
            end_date = employee.get('end', 'N/A')
            print(f"• {name}: {start_date} to {end_date}")
        print("--- End of vacation list ---\n")
    
if __name__ == "__main__":
    main()