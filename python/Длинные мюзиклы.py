# Напишите функцию get_result(name), которая принимает на вход имя файла базы данных, по структуре идентичной «films.db»,
# и выполняет запрос, обновляющий таблицу с фильмами таким образом, чтобы длина мюзиклов, превышающая 100 минут, стала равна 100.

# Импорт библиотеки
import sqlite3

def get_result(db_name):
    # Подключение к БД
    con = sqlite3.connect(db_name)

    # Создание курсора
    cur = con.cursor()

    # Выполнение запроса и получение всех результатов
    result = cur.execute("""SELECT id
        FROM genres
        WHERE title = 'мюзикл'""").fetchall()
    genre_id = result[0][0]
    
    # Выполнение запроса
    cur.execute("""UPDATE films SET duration = 100
        WHERE genre = ? AND duration > 100""", (genre_id,)).fetchall()
    
    con.commit()
    con.close()


# db_name = input()
get_result('films_db.sqlite')