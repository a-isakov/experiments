# Напишите функцию get_result(name), которая принимает на вход имя файла базы данных, по структуре идентичной films.db,
# и обновляет информацию о фильмах: поле с длительностью фильма, если оно изначально пустое (пустая строка), должно стать
# равным 42 минутам.

# Импорт библиотеки
import sqlite3

def get_result(db_name):
    # Подключение к БД
    con = sqlite3.connect(db_name)

    # Создание курсора
    cur = con.cursor()

    # Выполнение запроса
    cur.execute("""UPDATE films SET duration = 42
        WHERE duration is NULL OR duration = ''""").fetchall()
    
    con.commit()
    con.close()


# db_name = input()
get_result('films_db.sqlite')