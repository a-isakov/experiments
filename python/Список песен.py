# Вашему приложению доступна база данных music_db.sqlite, в которой есть таблицы, соответствующие данной схеме.

# Напишите программу, которая считывает имя исполнителя, и выводит все неповторяющиеся названия треков этого исполнителя,
# упорядоченные по алфавиту, каждый трек с новой строки.
# Формат ввода
# Одна строка — название исполнителя.
# Формат вывода
# Результат запроса — названия музыкальных треков, каждое с новой строки.
# Примечания
# Названия таблиц и полей в базе данных не чувствительны к регистру, то есть "ArtistId" то же, что "artistid".

# Импорт библиотеки
import sqlite3

# Подключение к БД
con = sqlite3.connect('music_db.sqlite')

artist_name = input()

# Создание курсора
cur = con.cursor()

# Выполнение запроса и получение всех результатов
result = cur.execute("""SELECT DISTINCT Track.Name
    FROM Track JOIN Album ON Track.AlbumId = Album.AlbumId JOIN Artist ON Artist.ArtistId = Album.ArtistId
    WHERE Artist.Name = ?
    ORDER BY Track.Name""", (artist_name,)).fetchall()

# Вывод результатов на экран
for elem in result:
    print(elem[0])