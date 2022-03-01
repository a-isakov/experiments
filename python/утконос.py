import json
import requests


fw = open('dishes.csv', mode='w', encoding="utf-8")
fw.write(f"animal:habitat:meal\n")
qq = []
with open('treats.json') as cat_file:
    data = json.load(cat_file)
    server = data['server']
    port = data['port']
    sort = data['sort']
    request = f"http://{server}:{port}"
    response = requests.get(request)
    if response.status_code == 200:
        result = response.json()
        for item in result:
            if item['sort'] == sort:
                for meal in item['meal']:
                    animal = item['animal']
                    habitat = item['habitat']
                    # meal = item['meal']
                    qq.append(f"{animal}:{habitat}:{meal}\n")
                    # fw.write(f"{animal}:{habitat}:{meal}\n")
qq.sort()
for item in qq:
    fw.write(item)
fw.close()
