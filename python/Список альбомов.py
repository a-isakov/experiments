# Вашему приложению доступна база данных music_db.sqlite, в которой есть таблицы, соответствующие данной схеме.

# Напишите программу, которая считывает название жанра, и выводит все названия альбомов, где есть хотя бы один трек в этом жанре.
# Альбомы необходимо выводить упорядоченно по id исполнителя, а затем по алфавиту, каждое название с новой строки.
# Формат ввода
# Одна строка — название жанра.
# Формат вывода
# Результат запроса — названия альбомов, каждое с новой строки.
# Примечания
# Названия таблиц и полей в базе данных не чувствительны к регистру, то есть "ArtistId" то же, что "artistid". 

# Импорт библиотеки
import sqlite3

# Подключение к БД
con = sqlite3.connect('music_db.sqlite')

genre_name = input()

# Создание курсора
cur = con.cursor()

# Выполнение запроса и получение всех результатов
result = cur.execute("""SELECT DISTINCT Album.Title
    FROM Track JOIN Album ON Track.AlbumId = Album.AlbumId JOIN Genre ON Genre.GenreId = Track.GenreId
    WHERE Genre.Name = ?
    ORDER BY Album.ArtistId, Track.Name""", (genre_name,)).fetchall()

# Вывод результатов на экран
for elem in result:
    print(elem[0])