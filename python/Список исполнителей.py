# Вашему приложению доступна база данных music_db.sqlite, в которой есть таблицы, соответствующие данной схеме.

# Напишите программу, которая считывает название жанра, и выводит все имена исполнителей, у которых есть хотя бы один трек
# в этом жанре, упорядоченные по алфавиту, каждое название с новой строки.
# Формат ввода
# Одна строка — название жанра.
# Формат вывода
# Результат запроса — названия исполнителей, каждое с новой строки.
# Примечания
# Названия таблиц и полей в базе данных не чувствительны к регистру, то есть "ArtistId" то же, что "artistid".

# Если вам кажется, что запрос получается очень громоздкий, это действительно так :) Почитайте про оператор JOIN и попробуйте
# оптимизировать свой запрос.

# Импорт библиотеки
import sqlite3

# Подключение к БД
con = sqlite3.connect('music_db.sqlite')

genre_name = input()

# Создание курсора
cur = con.cursor()

# Выполнение запроса и получение всех результатов
result = cur.execute("""SELECT DISTINCT Artist.Name
    FROM Track JOIN Album ON Track.AlbumId = Album.AlbumId
        JOIN Artist ON Artist.ArtistId = Album.ArtistId
        JOIN Genre ON Genre.GenreId = Track.GenreId
    WHERE Genre.Name = ?
    ORDER BY Artist.Name""", (genre_name,)).fetchall()

# Вывод результатов на экран
for elem in result:
    print(elem[0])