from calendar import monthrange
import snowflake.connector
import json
import requests

queryText =  """
-- Query to estimate the cost
WITH stats AS (
    SELECT
        DATABASE_NAME,
        SUBSTRING(QUERY_TAG, POSITION('aid=' in QUERY_TAG)+4, 10) as AID,
        ARRAY_REMOVE_AT(ARRAY_REMOVE_AT(SPLIT(WAREHOUSE_NAME, '_'), 0), 0) as WH_SPLIT,
        WH_SPLIT[ARRAY_SIZE(WH_SPLIT) - 2] as WH_SIZE,
        CASE
            WHEN WH_SIZE = 'XS' THEN 0.0003
            WHEN WH_SIZE = 'S'  THEN 0.0006
            WHEN WH_SIZE = 'M'  THEN 0.0011
            WHEN WH_SIZE = 'L'  THEN 0.0022
            WHEN WH_SIZE = 'XL' THEN 0.0044
            ELSE 0
        END as CREDITS,
        (TOTAL_ELAPSED_TIME*CREDITS)*1.65/1000 as USD,
        CASE
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_AB_TEST_%' THEN 'A/B Test'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_AAM_%' THEN 'AAM'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_ACTIVITY_%' THEN 'Activity'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_CHURN_PREVENTION_%' THEN 'Churn Prevention'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_COMPOSER_CONVERSIONS_%' THEN 'Conversions (Composer)'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_VX_CONVERSIONS_%' THEN 'Conversions (VX)'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_EMAIL_%' THEN 'Email'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_FLOW_%' THEN 'Flow'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_GDPR_%' THEN 'GDPR'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_LTS_%' THEN 'LTS'
            --WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_COMPOSER_VERSIONS_%' THEN 'Versions (common)' -- excluded because it's for everything at once
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_REVREC_%' THEN 'Revenue Recognition'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_SUBSCRIPTION_%' THEN 'Subscription Log'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_SUSPICIOUS_ACTIVITY_%' THEN 'Suspicious Activity'
            ELSE 'Other'
        END as REPORT_NAME
    FROM snowflake.account_usage.query_history
    WHERE --START_TIME >= dateadd('day', -1, current_timestamp())
        START_TIME >= 'START_DATE_TO_REPLACE' AND START_TIME < 'END_DATE_TO_REPLACE'
        AND WAREHOUSE_NAME LIKE 'AI_REPORTS_%'
        AND (DATABASE_NAME is not NULL OR WAREHOUSE_NAME LIKE 'AI_REPORTS_LTS_%')
        AND (DATABASE_NAME != 'DCS_MASTER' OR WAREHOUSE_NAME LIKE 'AI_REPORTS_LTS_%')
)

SELECT MERCHANT_ID, DATABASE_NAME, MERCHANT_NAME, AID, REPORT_NAME, SUM(USD) as USD
FROM (
    SELECT m.MERCHANT_ID, m.DATABASE_NAME, m.MERCHANT_NAME, s.AID, s.REPORT_NAME, s.USD
    FROM stats s JOIN DCS_MASTER.PUBLIC.MERCHANTS m ON s.DATABASE_NAME = m.DATABASE_NAME
    WHERE s.DATABASE_NAME is not NULL

    UNION ALL
    
    SELECT m.MERCHANT_ID, m.DATABASE_NAME, m.MERCHANT_NAME, s.AID, s.REPORT_NAME, s.USD
    FROM stats s JOIN DCS_MASTER.PUBLIC.APPLICATIONS m ON s.AID = LOWER(m.AID)
    WHERE s.DATABASE_NAME is NULL
)
GROUP BY DATABASE_NAME, REPORT_NAME, MERCHANT_ID, MERCHANT_NAME, AID
ORDER BY USD DESC, DATABASE_NAME, REPORT_NAME;
"""

def createMeasurementObject(row, period):
    merchantId = row[0]
    # dbName = row[1]
    merchantName = row[2]
    aid = row[3]
    reportName = row[4]
    consumption = row[5]
    measurement = {}
    measurement["period"] = period
    measurement["key"] = "report_consumption"
    # measurement["value"] = float(consumption)
    measurement["values"] = {}
    measurement["values"]["amount"] = float(consumption)
    measurement["properties"] = {}
    measurement["properties"]["vx_merch_id"] = int(merchantId)
    measurement["properties"]["vx_merch_name"] = merchantName
    measurement["properties"]["aid"] = aid
    measurement["properties"]["report_name"] = reportName
    return measurement

def sendMeasurements(conn, apiKey, dateRange):
    cursorPrepare = conn.cursor()
    cursorPrepare.execute('USE SECONDARY ROLES ALL;')
    cursorPrepare.close()
    cursorPrepare2 = conn.cursor()
    cursorPrepare2.execute('USE ROLE DCS_DEVELOPER;')
    # cursorPrepare2.execute('USE ROLE ACCOUNT_USAGE;')
    cursorPrepare2.close()
    for dateItem in dateRange:
        sql = queryText.replace("START_DATE_TO_REPLACE", dateItem[0]).replace("END_DATE_TO_REPLACE", dateItem[1])
        # print(sql)
        cursor = conn.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        # prepare object with measurements
        measurements = dict()
        measurements["measurements"] = []
        for row in results:
            measurement = createMeasurementObject(row, dateItem[0])
            measurements["measurements"].append(measurement)
        cursor.close()

        # print("----------------")
        # format ndjson
        result = [json.dumps(record) for record in measurements["measurements"]]
        ndjson = '\n'.join(result)
        # print(ndjson)
        print(dateItem[0], len(measurements["measurements"]), "measurements")

        headers = {'Content-Type': 'application/x-ndjson', 'x-api-key': '520bfea83a24_' + apiKey}
        response = requests.post("https://measurements-beta.pa-cd.com/measurements/v1/PIANO", data=ndjson, headers=headers)
        print(response.status_code)
        # print(response)

reportYear = 2024
reportMonth = 2
dates = []
# gather days of month into the array
# for days in range(monthrange(reportYear, reportMonth)[1] - 1):
#     startDate = f"{reportYear}-{reportMonth:02d}-{days+1:02d}"
#     endDate = f"{reportYear}-{reportMonth:02d}-{days+2:02d}"
#     dates.append((startDate, endDate))
# startDate = f"{reportYear}-{reportMonth:02d}-{monthrange(reportYear, reportMonth)[1]:02d}"
# if reportMonth == 12:
#     reportYear += 1
#     reportMonth = 0
# endDate = f"{reportYear}-{reportMonth+1:02d}-01"
# dates.append((startDate, endDate))
# print(dates)
# manual array composition
dates.append(("2024-04-29", "2024-04-30"))

print("API Key:")
apiKey = input()
print("Username:")
sfUser = input()
# print("Password:")
# sfPassword = input()
# print("Warehouse:")
# sfWarehouse = input()
sfWarehouse = 'PIANO_PUBLIC_XS'

try:
    conn = snowflake.connector.connect(
        user=sfUser,
        # password=sfPassword,
        authenticator='externalbrowser',
        account='ru86569.eu-west-1',
        warehouse=sfWarehouse
        )
    sendMeasurements(conn, apiKey, dates)
    conn.close()

except Exception as err:
    print("Error: ", err)
