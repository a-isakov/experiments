import requests


api_key = "40d1649f-0493-4b70-98ba-98533de7710b"  # взято из учебника
search_string = "Москва, Петровка, 38"
map_request = "https://geocode-maps.yandex.ru/1.x"
map_request += f"?apikey={api_key}"
map_request += f"&geocode={search_string}"
map_request += f"&results=1"
map_request += f"&format=json"
response = requests.get(map_request)
if response.status_code == 200:
    result = response.json()
    geo_object = result['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']
    print('Почтовый индекс Московского Уголовного Розыска (МУРа):', geo_object['metaDataProperty']['GeocoderMetaData']['Address']['postal_code'])
else:
    print('Ошибка')