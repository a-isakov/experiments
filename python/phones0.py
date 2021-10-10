# Огромное количество программ сталкиваются с обработкой входящих данных, их преобразованием и проверкой на корректность.
# Давайте попробуем себя на этом поприще. Данную задачу решите пока без использования исключений.
# В дальнейшем код этой задачи послужит основой, "заготовкой"для дальнейшей работы.

# Напишите программу, проверяющую корректность введенного номера сотового телефона в РФ по следующим критериям:
# Номер может начинаться как с +7, так и с 8
# Допускается любое количество любых пробельных символов в любом месте, например, +7 905 3434   341.
# Допускается наличие в любом месте одной пары скобок (обязательно пары), например: 8 (905) 3434 341.
# Допускается наличие любого количества знаков -, только не подряд (--), не в начале и не в конце. Например, +7 905-34-34-341.
# Если введенный номер корректен, он преобразуется к формату +79053434341. То есть 8 заменяется на +7, а все другие символы-НЕцифры 
# убираются. В итоговой записи остается 11 цифр.
# Если же номер не удовлетворяет перечисленным условиям, выводится слово error.

# Пример 1
# Ввод	Вывод
# +7(902)123-4567
# +79021234567
# Пример 2
# Ввод	Вывод
# 8(902)1-2-3-45-67
# +79021234567
# Пример 3
# Ввод	Вывод
# 504))635(22))9	9
# error
# Пример 4
# Ввод	Вывод
# 8--9019876543-22-3--4
# error

phone_num = input().strip()
error = False
first_parenthese = False
second_parenthese = False
result = ''
digits = 0
if len(phone_num) < 2:
    error = True
else:
    if phone_num[0] == '8':
        digits += 1
        phone_num = phone_num[1:]
        result = '+7'
    elif phone_num[:2] == '+7':
        digits += 1
        phone_num = phone_num[2:]
        result = '+7'
    else:
        error = True

if not error:
    for i in range(len(phone_num)):
        c = phone_num[i]
        if ord(c) >= 48 and ord(c) <= 57:
            result += c
            digits += 1
        elif c == ' ' or c == '\t':
            continue
        elif c == '-':
            if i == len(phone_num) - 1:
                error = True
                break
            elif phone_num[i - 1] == '-':
                error = True
                break
        elif c == '(':
            if first_parenthese or second_parenthese:
                error = True
                break
            first_parenthese = True
        elif c == ')':
            if not first_parenthese or second_parenthese:
                error = True
                break
            second_parenthese = True
        else:
            error = True
            break

if digits != 11:
    error = True

if first_parenthese and not second_parenthese:
    error = True
elif not first_parenthese and second_parenthese:
    error = True

if error:
    print('error')
else:
    print(result)