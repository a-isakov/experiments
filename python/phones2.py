# Перепишите программу 1 с использованием исключений в таком стиле: идет преобразование данных к формату вывода исходя из того,
# что пользователь ввел корректные данные. Если что-то идет не так, выводится error.
# Для этого заключите блок преобразований в try...except и попытайтесь перечислить в except несколько возможных типов исключений,
# случающихся для разных данных.

# Обратите внимание, что в блоке try вы можете использовать raise cо стандартными исключениями.

# Подумайте, будет ли корректно перехватывать любые исключения, написав один класс Exception.

def correct_num(phone_num):
    phone_num = phone_num.strip()
    first_parenthese = False
    second_parenthese = False
    result = ''
    digits = 0
    if len(phone_num) < 2:
        raise ValueError('error')
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
            raise ValueError('error')

    for i in range(len(phone_num)):
        c = phone_num[i]
        if ord(c) >= 48 and ord(c) <= 57:
            result += c
            digits += 1
        elif c == ' ' or c == '\t':
            continue
        elif c == '-':
            if i == len(phone_num) - 1:
                raise ValueError('error')
            elif phone_num[i - 1] == '-':
                raise ValueError('error')
        elif c == '(':
            if first_parenthese or second_parenthese:
                raise ValueError('error')
            first_parenthese = True
        elif c == ')':
            if not first_parenthese or second_parenthese:
                raise ValueError('error')
            second_parenthese = True
        else:
            raise ValueError('error')

    if digits != 11:
        raise ValueError('error')

    if first_parenthese and not second_parenthese:
        raise ValueError('error')
    elif not first_parenthese and second_parenthese:
        raise ValueError('error')

    return result


try:
    phone_num = input()
    corrected_num = correct_num(phone_num)
    print(corrected_num)
except ValueError as e:
    print(e)