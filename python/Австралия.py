import os
import sys

import pygame
import requests


api_key = "40d1649f-0493-4b70-98ba-98533de7710b"  # взято из учебника
search_string = "Австралия"
map_request = "https://geocode-maps.yandex.ru/1.x"
map_request += f"?apikey={api_key}"
map_request += f"&geocode={search_string}"
map_request += f"&results=1"
map_request += f"&format=json"
response = requests.get(map_request)
if response.status_code == 200:
    result = response.json()
    print(result)
    geo_object = result['response']['GeoObjectCollection']['featureMember'][0]['GeoObject']
    lowerCorner = geo_object['boundedBy']['Envelope']['lowerCorner'].split(' ')
    upperCorner = geo_object['boundedBy']['Envelope']['upperCorner'].split(' ')

    map_request = "http://static-maps.yandex.ru/1.x/"
    map_request += f"?apikey={api_key}"
    map_request += f"&bbox={lowerCorner[0]},{lowerCorner[1]}~{upperCorner[0]},{upperCorner[1]}"
    map_request += f"&l=sat"
    response = requests.get(map_request)

    if response.status_code != 200:
        print("Ошибка выполнения запроса:")
        print(map_request)
        print("Http статус:", response.status_code, "(", response.reason, ")")
        sys.exit(1)

    # Запишем полученное изображение в файл.
    map_file = "map.png"
    with open(map_file, "wb") as file:
        file.write(response.content)

    # Инициализируем pygame
    pygame.init()
    screen = pygame.display.set_mode((600, 450))
    # Рисуем картинку, загружаемую из только что созданного файла.
    screen.blit(pygame.image.load(map_file), (0, 0))
    # Переключаем экран и ждем закрытия окна.
    pygame.display.flip()
    while pygame.event.wait().type != pygame.QUIT:
        pass
    pygame.quit()

    # Удаляем за собой файл с изображением.
    os.remove(map_file)
else:
    print('Ошибка')
