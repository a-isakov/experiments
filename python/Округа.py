import requests


def get_province(city):
    api_key = "40d1649f-0493-4b70-98ba-98533de7710b"  # взято из учебника
    map_request = "https://geocode-maps.yandex.ru/1.x"
    map_request += f"?apikey={api_key}"
    map_request += f"&geocode={city}"
    map_request += f"&results=1"
    map_request += f"&format=json"
    response = requests.get(map_request)
    if response.status_code == 200:
        result = response.json()
        components = result['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['Components']
        for component in components:
            if component['kind'] == 'province':
                return component['name']

    return 'Не найдено'


def print_province(city):
    print(city, '-', get_province(city))


print_province('Хабаровск')
print_province('Уфа')
print_province('Нижний Новгород')
print_province('Калининград')
