# Импорт библиотеки
import sqlite3


class SnowRace():
    con = 0

    def __init__(self, name):
        self.con = sqlite3.connect(name)

    # метод принимает дату начала путешествия и пункт старта, а возвращает список строк
    # Фамилия Имя всех участников гонки, порядок алфавитный; 
    def race_members(self, start, location):
        # Создание курсора
        cur = self.con.cursor()

        # Выполнение запроса и получение всех результатов
        result = cur.execute("""SELECT
                participants.surname, participants.name
            FROM participants
                JOIN members ON members.person_id = participants.id
                JOIN trips ON members.trip_id = trips.trip_id
            WHERE trips.start_point = ? AND trips.start_date = ?
            ORDER BY participants.surname, participants.name""", (location, start)).fetchall()

        names = []
        # # Вывод результатов на экран
        for elem in result:
            # print(elem[0], elem[1])
            names.append(f"{elem[0]} {elem[1]}")
        return names

    # метод принимает фамилию участника гонок, а возвращает список всех городов
    # (и начальных, и конечных), в которых он побывал во время учтенных в БД гонок,
    # без повторений. Возвращаемый список отсортирован по алфавиту.
    def visited(self, surname):
        # Создание курсора
        cur = self.con.cursor()

        # Выполнение запроса и получение всех результатов
        result = cur.execute("""SELECT
                trips.start_point,
                trips.end_point
            FROM
                participants
                LEFT JOIN members ON members.person_id = participants.id
                JOIN trips ON trips.trip_id = members.trip_id
            WHERE
                participants.surname = ?""", (surname,)).fetchall()

        locations = set()
        # # Вывод результатов на экран
        for elem in result:
            locations.add(elem[0])
            locations.add(elem[1])
            # print(elem[0], elem[1])
        # locations = list(locations)
        locations = sorted(locations)
        # for elem in locations:
        #     print(elem)
        return locations