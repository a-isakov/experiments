from calendar import monthrange
import snowflake.connector
import json
import requests

queryText =  """
-- Query to estimate the cost
WITH stats AS (
    SELECT
        DATABASE_NAME,
        ARRAY_REMOVE_AT(ARRAY_REMOVE_AT(SPLIT(WAREHOUSE_NAME, '_'), 0), 0) as WH_SPLIT,
        WH_SPLIT[ARRAY_SIZE(WH_SPLIT) - 2] as WH_SIZE,
        TOTAL_ELAPSED_TIME,
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
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_COMPOSER_VERSIONS_%' THEN 'Versions (common)'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_REVREC_%' THEN 'Revenue Recognition'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_SUBSCRIPTION_%' THEN 'Subscription Log'
            WHEN WAREHOUSE_NAME LIKE 'AI_REPORTS_SUSPICIOUS_ACTIVITY_%' THEN 'Suspicious Activity'
            ELSE 'Other'
        END as REPORT_NAME,
        CASE
            WHEN WH_SIZE = 'XS' THEN 0.0003
            WHEN WH_SIZE = 'S'  THEN 0.0006
            WHEN WH_SIZE = 'M'  THEN 0.0011
            WHEN WH_SIZE = 'L'  THEN 0.0022
            WHEN WH_SIZE = 'XL' THEN 0.0044
            ELSE 0
        END as CREDITS
    FROM query_history
    WHERE --START_TIME >= dateadd('day', -1, current_timestamp())
        START_TIME >= 'START_DATE_TO_REPLACE' AND START_TIME < 'END_DATE_TO_REPLACE'
        AND WAREHOUSE_NAME LIKE 'AI_REPORTS_%'
        AND DATABASE_NAME is not NULL
        AND DATABASE_NAME != 'DCS_MASTER'
    --LIMIT 10
)

SELECT m.MERCHANT_ID, s.DATABASE_NAME, m.MERCHANT_NAME, s.REPORT_NAME, SUM(s.TOTAL_ELAPSED_TIME*s.CREDITS)*1.65/1000 as USD
FROM stats s JOIN DCS_MASTER.PUBLIC.MERCHANTS m ON s.DATABASE_NAME = m.DATABASE_NAME
GROUP BY s.DATABASE_NAME, s.REPORT_NAME, m.MERCHANT_ID, m.MERCHANT_NAME
ORDER BY s.DATABASE_NAME, s.REPORT_NAME;
"""

def createMeasurementObject(row, period):
    merchantId = row[0]
    # dbName = row[1]
    merchantName = row[2]
    reportName = row[3]
    consumption = row[4]
    measurement = {}
    measurement["period"] = period
    measurement["key"] = "report_consumption"
    measurement["value"] = float(consumption)
    measurement["properties"] = {}
    measurement["properties"]["vx_merch_id"] = int(merchantId)
    measurement["properties"]["vx_merch_name"] = merchantName
    measurement["properties"]["report_name"] = reportName
    return measurement

def sendMeasurements(conn, dateRange):
    for dateItem in dateRange:
        sql = queryText.replace("START_DATE_TO_REPLACE", dateItem[0]).replace("END_DATE_TO_REPLACE", dateItem[1])
        # print(sql)
        cursor = conn.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        measurements = dict()
        measurements["measurements"] = []
        for row in results:
            measurement = createMeasurementObject(row, dateItem[0])
            measurements["measurements"].append(measurement)
        cursor.close()

        # print("----------------")
        result = [json.dumps(record) for record in measurements["measurements"]]
        ndjson = '\n'.join(result)
        # print(ndjson)
        print(dateItem[0], len(measurements["measurements"]), "measurements")

        headers = {'Content-Type': 'application/x-ndjson', 'x-api-key': '520bfea83a24_secret'}
        response = requests.post("https://measurements-beta.pa-cd.com/measurements/v1/PIANO", data=ndjson, headers=headers)
        print(response.status_code)
        # print(response)

# reportYear = 2024
# reportMonth = 2
dates = []
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
dates.append(("2024-02-13", "2024-02-14"))

print("Username:")
sfUser = input()
print("Password:")
sfPassword = input()
print("Warehouse:")
sfWarehouse = input()

try:
    conn = snowflake.connector.connect(
        user=sfUser,
        password=sfPassword,
        account='ru86569.eu-west-1',
        warehouse=sfWarehouse
        )
    # sendMeasurements(conn, [('2023-02-28', '2023-03-01')])
    sendMeasurements(conn, dates)
    conn.close()

except:
    print("Error")
