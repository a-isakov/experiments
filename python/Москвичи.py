import json
from zipfile import ZipFile


with ZipFile('input.zip') as myzip:
    items = myzip.namelist()
    counter = 0
    for item in items:
        if item[-5:] == '.json':
            with myzip.open(item, 'r') as file:
                data = json.load(file)
                if data['city'] == 'Москва':
                    counter += 1
    print(counter)
