# В файле input.txt записаны имена файлов с расширениями и информационным объёмом, каждый с новой строки.

# Напишите программу, которая сгруппирует файлы по расширению, найдёт для каждого из них общий объём и выведет в файл output.txt все файлы с итогом по группам в соответствии
# с расширением в алфавитном порядке. Внутри групп файлы сортируются также в алфавитном порядке по именам.

# Итоговое значение объёма группы файлов записывается в самых крупных единицах измерения с округлением до целых.
# Пример
# Ввод 	Вывод

# input.txt 3000 B
# scratch.zip 5 MB
# output.txt 1 KB
# temp.txt 4 KB
# boy.bmp 2000 KB
# mario.bmp 1 MB
# data.zip 900 KB


# boy.bmp
# mario.bmp
# ----------
# Summary: 3 MB

# input.txt
# output.txt
# temp.txt
# ----------
# Summary: 8 KB

# data.zip
# scratch.zip
# ----------
# Summary: 6 MB

# Примечания

# В программе ничего не вводится с клавиатуры и ничего не выводится на экран. Все действия производятся с файлами. В примере показано содержимое входного и выходного файлов.
# Значения единиц измерения такие же, как принято в информатике (B, KB, MB, GB, TB).


f = open('input.txt', encoding="utf-8")
lines = f.readlines()
f.close()

groups = dict()
extensions = []

for line in lines:
    values = line.rstrip().split(' ')
    filename = values[0]
    size = values[1]
    size_multiplier = values[2]

    if size_multiplier == 'B':
        size = int(size)
    elif size_multiplier == 'KB':
        size = int(size) * 1024
    elif size_multiplier == 'MB':
        size = int(size) * 1024 * 1024
    elif size_multiplier == 'GB':
        size = int(size) * 1024 * 1024 * 1024
    elif size_multiplier == 'TB':
        size = int(size) * 1024 * 1024 * 1024 * 1024
    else:
        size = 0

    name_values = filename.split('.')
    name = name_values[0]
    extension = name_values[1]

    group = groups.get(extension)
    if group is None:
        extensions.append(extension)
        group = []
        group.append(size)
        group.append([])
        group[1].append(filename)
        groups[extension] = group
    else:
        group[0] += size
        group[1].append(filename)

extensions.sort()
f = open('output.txt', mode='w', encoding="utf-8")
for extension in extensions:
    group = groups[extension]
    files = group[1]
    files.sort()
    for file in files:
        file += '\n'
        f.write(file)
        # print(file)
    f.write('----------\n')
    # print('----------')
    size = group[0]
    size_multiplier = ''
    if size < 1024:
        size_multiplier = 'B\n'
    elif size < 1024 * 1024:
        size_multiplier = 'KB\n'
        size = round(size / 1024)
    elif size < 1024 * 1024 * 1024:
        size_multiplier = 'MB\n'
        size = round(size / 1024 / 1024)
    elif size < 1024 * 1024 * 1024 * 1024:
        size_multiplier = 'GB\n'
        size = round(size / 1024 / 1024 / 1024)
    elif size < 1024 * 1024 * 1024 * 1024 * 1024:
        size_multiplier = 'TB\n'
        size = round(size / 1024 / 1024 / 1024 / 1024)
    # print('Summary:', size, size_multiplier)
    summary = 'Summary: ' + str(size) + ' ' + size_multiplier + '\n'
    f.write(summary)
f.close()
