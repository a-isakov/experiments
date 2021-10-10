# А теперь сделайте также проверку корректности кодов стран в случае, когда номер телефона начинается с "+", то есть допустимыми
# являются не только +7, но и такие коды: +359, +55, +1.
# Несоответствие по этому критерию назовите "не определяется код страны".

# Пример 1
# Ввод	Вывод
#  864357))4  92	8  2
# неверный формат
# Пример 2
# Ввод	Вывод
# 8  114356 30
# неверное количество цифр
# Пример 3
# Ввод	Вывод
# +79700830356
# не определяется оператор сотовой связи
# Пример 4
# Ввод	Вывод
# 8(916)    12 4 32-6 7
# +79161243267
# Примечания
# В других странах операторы сотовой связи, которые работают в нашей стране могут не действовать, поэтому корректность операторов
# сотовой связи в других странах проверять не нужно.

def correct_num(phone_num):
    phone_num = phone_num.strip()
    first_parenthese = False
    second_parenthese = False
    russian = False
    country = False
    result = ''
    digits = 0
    if len(phone_num) < 2:
        raise ValueError('неверный формат')
    else:
        if phone_num[0] == '8':
            digits += 1
            phone_num = phone_num[1:]
            result = '+7'
            russian = True
            country = True
        elif phone_num[:2] == '+7':
            digits += 1
            phone_num = phone_num[2:]
            result = '+7'
            russian = True
            country = True
        elif phone_num[:2] == '+1':
            digits += 1
            phone_num = phone_num[2:]
            result = '+1'
            country = True
        elif phone_num[:3] == '+55':
            digits += 2
            phone_num = phone_num[3:]
            result = '+55'
            country = True
        elif phone_num[:4] == '+359':
            digits += 3
            phone_num = phone_num[4:]
            result = '+359'
            country = True
        elif phone_num[0] == '+':
            phone_num = phone_num[1:]
            result = '+'
        else:
            raise ValueError('неверный формат')

    for i in range(len(phone_num)):
        c = phone_num[i]
        if ord(c) >= 48 and ord(c) <= 57:
            result += c
            digits += 1
        elif c == ' ' or c == '\t':
            continue
        elif c == '-':
            if i == len(phone_num) - 1:
                raise ValueError('неверный формат')
            elif phone_num[i - 1] == '-':
                raise ValueError('неверный формат')
        elif c == '(':
            if first_parenthese or second_parenthese:
                raise ValueError('неверный формат')
            first_parenthese = True
        elif c == ')':
            if not first_parenthese or second_parenthese:
                raise ValueError('неверный формат')
            second_parenthese = True
        else:
            raise ValueError('неверный формат')

    if first_parenthese and not second_parenthese:
        raise ValueError('неверный формат')
    elif not first_parenthese and second_parenthese:
        raise ValueError('неверный формат')

    if russian:
        if digits != 11:
            raise ValueError('неверное количество цифр')

        code = int(result[2:5])
        operator = ''
        if (code >= 910 and code <= 919) or (code >= 980 and code <= 989):
            operator = 'МТС'
        elif code >= 920 and code <= 939:
            operator = 'МегаФон'
        elif (code >= 902 and code <= 906) or (code >= 960 and code <= 969):
            operator = 'Билайн'
        if operator == '':
            raise ValueError('не определяется оператор сотовой связи')

    if not country:
        raise ValueError('не определяется код страны')

    return result


try:
    phone_num = input()
    corrected_num = correct_num(phone_num)
    print(corrected_num)
except ValueError as e:
    print(e)