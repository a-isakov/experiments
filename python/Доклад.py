import sqlite3

min_salt = int(input())
max_depth = int(input())

# Подключение к БД
con = sqlite3.connect('reports.db')

# Создание курсора
cur = con.cursor()

# Выполнение запроса и получение всех результатов
result = cur.execute("""SELECT
                            depth,
                            location
                        FROM
                            Water
                        WHERE
                            depth <= ?
                            AND salinity >= ?
                        ORDER BY
                            location""", (max_depth, min_salt)).fetchall()

depths = dict()
for elem in result:
    # print(elem)
    if elem[0] not in depths:
        depths[elem[0]] = []
    depths[elem[0]].append(elem[1])

# print(depths)

con.commit()
con.close()