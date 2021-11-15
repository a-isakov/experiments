import sqlite3
import csv


def benefits(condition):
    # Подключение к БД
    con = sqlite3.connect('business.db')

    # Создание курсора
    cur = con.cursor()

    # Выполнение запроса и получение всех результатов
    result = cur.execute("""SELECT
                                Jobs.business,
                                Jobs.required_time,
                                Jobs.costs
                            FROM
                                Jobs
                                JOIN Conditions ON Conditions.id = Jobs.conditions_id
                            WHERE
                                Conditions.value = ?
                            ORDER BY
                                Jobs.costs ASC,
                                Jobs.required_time ASC,
                                Jobs.business ASC""", (condition, )).fetchall()
    with open('causes.csv', 'w', newline='') as csvfile:
        writer = csv.writer(
            csvfile, delimiter=':', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(['business', 'time', 'costs'])
        for elem in result:
            # print(elem)
            writer.writerow(elem)
    con.commit()
    con.close()

# benefits("low tide")
print('---')
benefits("high tide")