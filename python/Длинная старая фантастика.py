# Напишите функцию get_result(name), которая принимает на вход имя файла базы данных по структуре идентичной «films.db»,
# и выполняет запрос, удаляющий все фильмы в жанре фантастики, вышедшие до 2000 года, если их длина больше полутора часов.

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
        WHERE title = 'фантастика'""").fetchall()
    genre_id = result[0][0]
    
    # Выполнение запроса
    cur.execute("""DELETE FROM films
        WHERE genre = ? AND year < 2000 AND duration > 90""", (genre_id,)).fetchall()
    
    con.commit()
    con.close()


# db_name = input()
get_result('films_db.sqlite')