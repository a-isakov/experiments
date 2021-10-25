# Напишите функцию get_result(name), которая принимает на вход имя файла базы данных, по структуре идентичной «films.db»,
# и удаляет все фильмы в жанре комедии из БД.

# Импорт библиотеки
import sqlite3

def get_result(name):
    # Подключение к БД
    con = sqlite3.connect(db_name)

    # Создание курсора
    cur = con.cursor()

    # Выполнение запроса и получение всех результатов
    result = cur.execute("""SELECT id
        FROM genres
        WHERE title = 'комедия'""").fetchall()
    comedy_id = result[0][0]
    
    # Выполнение запроса
    cur.execute("""DELETE FROM films
        WHERE genre = ?""", (comedy_id,)).fetchall()


db_name = input()
get_result(db_name)