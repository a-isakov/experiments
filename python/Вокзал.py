# Формат ввода
# В файле schedule.txt находится расписание некоторых поездов в виде:
# Пункт назначения час:минуты
# В консоль вводится название пункта и текущее время.

# В примере написано, что вводится, и содержимое файла.

# Формат вывода
# В файл town_info.txt нужно вывести:
# общее количество рейсов в этот город;
# ближайший поезд;
# сколько минут осталось до отправления.

# Всё расписание укладывается в текущий день.

# Пример 1
# Ввод	Вывод
# stdin:
# Richmond 09:15

# file:
# Oxford 16:56
# Richmond 19:04
# Porthtowan 09:52
# Richmond 10:59
# Richmond 15:27
# Bedford 02:46
# Richmond 16:21
# Oxford 10:44
# Derbyshire 09:41

# 4
# 10:59
# 104
# Пример 2
# Ввод	Вывод
# stdin:
# Colchester 12:55

# file:
# Wiltshire 16:19
# Birmingham 21:48
# Colchester 03:01
# Portloe 19:50
# Cheshire 01:03
# Porthtowan 09:40
# Colchester 12:55
# Colchester 04:21
# Birmingham 18:42

# 3
# 12:55
# 0

from datetime import datetime

target = input()
target_values = target.split(' ') # делим строку по пробелу
current_time = datetime.strptime(target_values[1], '%H:%M') # текущее время (нашёл пример в интернете)

count = 0

fr = open('schedule.txt', encoding="utf-8")
min_time = datetime.strptime('23:59', '%H:%M') # здесь запомнить ближайшее время из доступных
for number, line in enumerate(fr): # построчно считываем файл
    if line[-1] == '\n': # убрать лишний перевод строки
        line = line[:-1]
    values = line.split(' ') # делим строку по пробелу
    if target_values[0] == values[0]: # если город совпал
        count += 1
        train_time = datetime.strptime(values[1], '%H:%M') # смотрим во сколько он отходит
        if train_time >= current_time and train_time < min_time: # если время отправления больше или равно текущему, запомним его
            min_time = train_time # запомнить есть время отправления меньше ближайшего
fr.close()
fw = open('town_info.txt', mode='w', encoding="utf-8")
fw.write(str(count) + '\n')
fw.write(min_time.strftime("%H:%M") + '\n')
fw.write(str(min_time.minute + min_time.hour * 60 - (current_time.minute + current_time.hour * 60)))
fw.close()
