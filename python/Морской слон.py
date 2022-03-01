import sys
import requests
import json


animals = []
host = sys.argv[1]
port = sys.argv[2]
min_amount = -1
length = -1
for i in range(3, len(sys.argv)):
    if min_amount == -2:
        min_amount = int(sys.argv[i])
    elif length == -2:
        length = int(sys.argv[i])
    elif sys.argv[i] == '--min_amount':
        min_amount = -2
    elif sys.argv[i] == '--length':
        length = -2
    else:
        animals.append(sys.argv[i])

# print(host, port, min_amount, length, animals)
request = f"http://{host}:{port}"
# print(request)
response = requests.get(request)
if response.status_code == 200:
    result = response.json()
    output = dict()
    for item in result:
        if min_amount >= 0 and int(item['amount']) >= min_amount:
            if length < 0 or (length >=0 and len(item['habitat']) <= length):
                if item['kind'] in animals:
                    if item['habitat'] not in output.keys():
                        output[item['habitat']] = []
                    output[item['habitat']].append([item['name'], item['amount']])

    with open('polar_zoo.json', 'w') as ofile:
        json.dump(output, ofile, ensure_ascii=False, indent=4)
    