# Напишите функцию get_result(name), которая принимает на вход имя файла базы данных, по структуре идентичной «films.db»,
# и выполняет запрос, обновляющий фильмы, выпущенные в 1973 году, путем уменьшения длины втрое.

# Импорт библиотеки
import sqlite3

def get_result(db_name):
    # Подключение к БД
    con = sqlite3.connect(db_name)

    # Создание курсора
    cur = con.cursor()

    # Выполнение запроса
    cur.execute("""UPDATE films SET duration = duration / 3
        WHERE year = 1973""").fetchall()
    
    con.commit()
    con.close()


# db_name = input()
get_result('films_db.sqlite')