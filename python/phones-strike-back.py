# Внесите модификации в программу 3 из классной работы так, чтобы учитывалась еще одно условие – принадлежность телефона одному
# из сотовых операторов. Если сотового оператора определить можно, то программа работает аналогично предыдущим заданиям.
# Если же сотовый оператор не определяется, тогда печатается фраза: "не определяется оператор сотовой связи".

# Список корректных 3-циферных значений прилагается:

# Коды МТС — 910..919, 980..989.

# Коды МегаФона — 920..939.

# Коды Билайна — 902..906, 960..969.
# Пример 1
# Ввод	Вывод
# +7(916)123-4567
# +79161234567
# Пример 2
# Ввод	Вывод
#  +7171((806243
# неверный формат
# Пример 3
# Ввод	Вывод
# --9(754310--4-5
# неверный формат
# Пример 4
# Ввод	Вывод
# +71113253136
# не определяется оператор сотовой связи

def correct_num(phone_num):
    phone_num = phone_num.strip()
    first_parenthese = False
    second_parenthese = False
    result = ''
    digits = 0
    if len(phone_num) < 2:
        raise ValueError('неверный формат')
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

    return result


try:
    phone_num = input()
    corrected_num = correct_num(phone_num)
    print(corrected_num)
except ValueError as e:
    print(e)