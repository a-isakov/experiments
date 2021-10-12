# Формат ввода
# Вводятся имена двух файлов.

# В первом файле находятся населённые пункты, через которые идут поезда, в формате: номер поезда, затем пункты через пробел. Каждый поезд с новой строки.

# Во втором файле записаны города, через любой из которых хотели бы проехать путешественники.

# В примерах показано содержимое сначала первого файла, затем второго.

# Формат вывода
# В файл train_numbers.txt выведите номера поездов, которые идут через любой из этих городов. Без повторений, порядок не важен.

# Пример 1
# Ввод	Вывод
# travel.txt
# wishes.txt

# 220 Montgomery Nottingham Portland
# 133 Tarleton Colchester Normanton Lincoln Woodleigh
# 243 Tarleton Normanton Lincoln
# 87 Montgomery Stafford
# 156 Colchester Chesterfield Milford Richmond
# 200 Wimborne Birmingham Woodleigh Manchester Nottingham

# Nottingham
# Tarleton
# Manchester

# 220
# 133
# 243
# 200
# Пример 2
# Ввод	Вывод
# trains.txt
# marks.txt

# 103 Bedfordshire Colchester Tarleton Portloe
# 160 Yorkshire Birmingham Wimborne
# 44 Wiltshire Colchester
# 96 Bedfordshire Bedford Woodleigh Lincoln Birmingham
# 147 Belvoir Normanton Montgomery Wimborne Woodleigh

# Wimborne
# Woodleigh
# Colchester

travel = input()
wishes = input()

travel_file = open(travel, encoding="utf-8")
wishes_file = open(wishes, encoding="utf-8")
train_numbers = open('train_numbers.txt', mode='w', encoding="utf-8")

lines = travel_file.readlines()
cities = wishes_file.readlines()

for i in range(len(cities)): # надо убрать лишние переводы строк из названий городов
    city = cities[i] # получаем строку
    if city[-1] == '\n': # если есть лишний символ
        city = city[:-1] # обрезаем строку, чтобы его убрать
    cities[i] = city # перезаписываем строку в массиве

for i in range(len(lines)): # смотрим все маршруты поездов
    line = lines[i]
    if line[-1] == '\n': # надо убрать лишний перевод строки из маршрута поезда
        line = line[:-1]
    train = line.split(' ') # маршрут разделим пробелами
    for j in range(1, len(train)): # первый элемент - номер поезда, надо его пропустить
        if train[j] in cities: # если город из маршрута есть в списке желаемых городов
            train_num = str(train[0]) + '\n'
            train_numbers.write(train_num)
            break

train_numbers.close()
travel_file.close()
wishes_file.close()