# Доработайте программу 2 таким образом, чтобы вместо слова error на экран выводились диагностические сообщения:

# "неверный формат" – нарушаются соглашения о пробелах, тире и / или скобках, а также присутствуют дополнительные символы,
# например, буквы.
# "неверное количество цифр", если цифр в телефоне в итоге не 11. Присутствует, только если формат оказался верным, то есть нет
# причин сообщать о предыдущей ошибке.

# Сообщение должно быть только одно для каждого телефона.
# Пример 1
# Ввод	Вывод
# 87393))985942
# неверный формат
# Пример 2
# Ввод	Вывод
# 79623  8)487
# неверный формат
# Пример 3
# Ввод	Вывод
# 8914273  13-87
# +79142731387
# Пример 4
# Ввод	Вывод
# 8846776422
# неверное количество цифр

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

    return result


try:
    phone_num = input()
    corrected_num = correct_num(phone_num)
    print(corrected_num)
except ValueError as e:
    print(e)