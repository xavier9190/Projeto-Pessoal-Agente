import os
import datetime
import requests
import json
import urllib.request
from google.oauth2 import service_account
from googleapiclient.discovery import build

def load_env():
    env_vars = {}
    if os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

def check_supabase_tables(url, key):
    print("\n--- Supabase (REST API) ---")
    if not url or not key:
        print("No Supabase URL or Key found.")
        return
    req_url = f"{url}/rest/v1/"
    headers = {"apikey": key, "Authorization": f"Bearer {key}"}
    try:
        req = urllib.request.Request(req_url, headers=headers)
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                paths = data.get("definitions", {})
                print("Tables available via REST API:")
                # The keys in 'definitions' correspond to the tables/views exposed
                for table in paths.keys():
                    print(f" - {table}")
            else:
                print(f"Error: {response.status}")
    except Exception as e:
        print(f"Supabase request failed: {e}")

def send_hello_hf(api_key):
    print("\n--- HuggingFace ---")
    if not api_key:
        print("No HuggingFace API key found.")
        return
    url = "https://router.huggingface.co/v1/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": "openai/gpt-oss-120b",  # ou "deepseek-ai/DeepSeek-R1:fastest"
        "messages": [{"role": "user", "content": "Please reply with a short 'Hello! How can I help you today?'"}],
        "max_tokens": 50
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            print(response.json()["choices"][0]["message"]["content"])
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")

def check_google_apis(credentials_file, test_email=None):
    print("\n--- Google APIs ---")
    if not credentials_file or not os.path.exists(credentials_file):
        print("No Google credentials file found.")
        return

    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/drive.readonly'
    ]
    creds = service_account.Credentials.from_service_account_file(credentials_file, scopes=scopes)
    
    # 1. Drive to find Spreadsheet
    try:
        drive_service = build('drive', 'v3', credentials=creds)
        results = drive_service.files().list(q="mimeType='application/vnd.google-apps.spreadsheet'", pageSize=1, fields="files(id, name)").execute()
        items = results.get('files', [])
        if not items:
            print("No spreadsheets found shared with this service account.")
        else:
            sheet_id = items[0]['id']
            sheet_name = items[0]['name']
            print(f"Found Spreadsheet: {sheet_name}")
            
            # 2. Sheets API to list tabs
            sheets_service = build('sheets', 'v4', credentials=creds)
            sheet_metadata = sheets_service.spreadsheets().get(spreadsheetId=sheet_id).execute()
            sheets = sheet_metadata.get('sheets', '')
            print("Pages (tabs) in this sheet:")
            for sheet in sheets:
                print(f" - {sheet.get('properties', {}).get('title', 'Unknown')}")
    except Exception as e:
        print(f"Error accessing Drive/Sheets: {e}")

    # 3. Calendar API to list events
    print("\n--- Google Calendar ---")
    try:
        calendar_service = build('calendar', 'v3', credentials=creds)
        
        if test_email:
            cal_id = test_email
            print(f"Checking events in calendar for email: {test_email}")
        else:
            calendar_list = calendar_service.calendarList().list().execute()
            cals = calendar_list.get('items', [])
            if not cals:
                print("No calendars found for this service account.")
                return
            cal_id = cals[0]['id']
            print(f"Checking events in calendar: {cals[0].get('summary')}")
            
        now = datetime.datetime.utcnow().isoformat() + 'Z'
        events_result = calendar_service.events().list(calendarId=cal_id, timeMin=now,
                                                       maxResults=3, singleEvents=True,
                                                       orderBy='startTime').execute()
        events = events_result.get('items', [])
        if not events:
            print('No upcoming events found.')
        for event in events:
            start = event['start'].get('dateTime', event['start'].get('date'))
            print(f" - {start}: {event.get('summary', 'No Title')}")
    except Exception as e:
        print(f"Error accessing Calendar: {e}")

if __name__ == "__main__":
    env_vars = load_env()
    check_supabase_tables(env_vars.get("SUPABASE_URL"), env_vars.get("SUPABASE_KEY"))
    send_hello_hf(env_vars.get("HUGGINGFACE_API_KEY"))
    check_google_apis(env_vars.get("GOOGLE_APPLICATION_CREDENTIALS"), env_vars.get("CALENDAR_EMAIL"))

