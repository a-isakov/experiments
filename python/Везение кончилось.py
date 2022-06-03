# Везение кончилось
# Ограничение времени 	10 секунд
# Ограничение памяти 	64Mb
# Ввод 	стандартный ввод
# Вывод 	стандартный вывод

# Одиннадцатого декабря, без четверти одиннадцать вечера, поезд остановился в Нью-Йорке, и путешественники поспешили в порт, где должен был стоять на якоре пароход до Ливерпуля. И тут везение закончилось: пароход «Китай» отправился в плавание сорок пять минут назад! Вся сумасшедшая гонка оказалась напрасной.

# Напишите программу, выбирающую пароходы.

# Через аргументы командной строки передаются адрес (address) и порт (port) сервера, а также имя файла csv (ﬁle), в котором записаны данные о ближайших пароходах. Заголовки файла (разделители запятые):
# id, порт следования, название парохода время отплытия
# id, port, steamer, departure

# Напишите приложение на ﬂask для того, чтобы при переходе по адресу http://address:port/luck возвращает словарь в формате json, в котором по ключу – часу отплытия записан список кораблей, отплывающих в этот час, в порядке увеличения времени отплытия, в случае одинакового по алфавиту.
# Пример
# Ввод 	Вывод

# # Пример запуска:
# python3 solution.py --address 127.0.0.1 --port 5000 --file steamers.csv
# # Содержание файла steamers.csv:
# id,port,steamer,departure
# 1,Seaham,Fairy,8:15
# 2,Blyth,Flosie,13:25
# 3,Wisbech,Garland,8:20
# 4,Felixstowe,Fortuna,13:06
# 5,Mistley,Harvester,9:05
# 6,Cowes,Hope,6:00
# 7,Fowey,Ajax,8:15

	

# {
#     "8": [
#         "Ajax",
#         "Fairy",
#         "Garland"
#     ],
#     "13": [
#         "Fortuna",
#         "Flosie"
#     ],
#     "9": [
#         "Harvester"
#     ],
#     "6": [
#         "Hope"
#     ]
# }

# Примечания

# CSV файл из примера можно скачать здесь



import argparse
# from flask_restful import reqparse, abort, Api, Resource
import csv
# import flask
from flask import Flask
# from http.server import HTTPServer, CGIHTTPRequestHandler
import time


def read_csv(name):
    result = dict()
    with open(name, encoding="utf8") as csvfile:
        reader = csv.DictReader(csvfile, delimiter=',', quotechar='"')
        # print(reader)
        items = sorted(reader, key=lambda x: time.strptime(x['departure'], '%H:%M'), reverse=False)
        for item in items:
            # print(time.strptime(item['departure'], '%H:%M').struct_time.tm_hour)
            hour = time.strptime(item['departure'], '%H:%M').tm_hour
            # print(time.strptime(item['departure'], '%H:%M').tm_hour)
            # print(item)
            if hour not in result.keys():
                result[hour] = []
            result[hour].append(item['steamer'])
        for key in result.keys():
            result[key].sort()
        # print(result)
        return result


parser = argparse.ArgumentParser()
parser.add_argument('--address', type=str)
parser.add_argument('--port', type=int)
parser.add_argument('--file', type=str)

args = parser.parse_args()
print(args.address)
print(args.port)
print(args.file)

# read_csv(args.file)

app = Flask(__name__)


@app.route('/luck')
def index():
    return read_csv(args.file)


if __name__ == '__main__':
    app.run(port=args.port, host=args.address)
