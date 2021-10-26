# Напишите функцию get_result(name), которая принимает на вход имя файла базы данных, по структуре идентичной «films.db»,
# и удаляет все фильмы, название которых начинается на букву „Я“ и заканчивается на букву „а“.

# Импорт библиотеки
import sqlite3

def get_result(db_name):
    # Подключение к БД
    con = sqlite3.connect(db_name)

    # Создание курсора
    cur = con.cursor()

    # Выполнение запроса
    cur.execute("""DELETE FROM films
        WHERE title LIKE 'Я%а'""").fetchall()
    
    con.commit()
    con.close()


# db_name = input()
get_result('films_db.sqlite')