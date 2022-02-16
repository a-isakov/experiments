import json


with open('scoring.json') as cat_file:
    data = json.load(cat_file)
    print(data)