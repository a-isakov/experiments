# Используя блоки assert, напишите программу для работы с паролем пользователя. На вход подается пароль,
# а на выход – «ok», если пароль соответствует критериям, «error» – не соответствует.

# Попробуйте перехватывать в ней AssertionError, а также просто Exception.
# Пример 1
# Ввод	Вывод
# 5оЫTuЬШrгэДЦ
# ok
# Пример 2
# Ввод	Вывод
# UQжeъGkBT7Uyui
# error
# Пример 3
# Ввод	Вывод
# WEсqОЛД
# error
# Примечания
# Критерии правильности пароля аналогичны критериям из задачи "Пароли часть 1"из классной работы.

def convert_c(c):
    if c == 'Q':
        return 'Й'
    elif c == 'W':
        return 'Ц'
    elif c == 'E':
        return 'У'
    elif c == 'R':
        return 'К'
    elif c == 'T':
        return 'Е'
    elif c == 'Y':
        return 'Н'
    elif c == 'U':
        return 'Г'
    elif c == 'I':
        return 'Ш'
    elif c == 'O':
        return 'Щ'
    elif c == 'P':
        return 'З'
    elif c == 'A':
        return 'Ф'
    elif c == 'S':
        return 'Ы'
    elif c == 'D':
        return 'В'
    elif c == 'F':
        return 'А'
    elif c == 'G':
        return 'П'
    elif c == 'H':
        return 'Р'
    elif c == 'J':
        return 'О'
    elif c == 'K':
        return 'Л'
    elif c == 'L':
        return 'Д'
    elif c == 'Z':
        return 'Я'
    elif c == 'X':
        return 'Ч'
    elif c == 'C':
        return 'С'
    elif c == 'V':
        return 'М'
    elif c == 'B':
        return 'И'
    elif c == 'N':
        return 'Т'
    elif c == 'M':
        return 'Ь'
    return c


def check_password(password):
    assert len(password) > 8

    has_small = False
    has_big = False
    has_digit = False
    password_copy = ''
    for i in range(len(password)):
        c = password[i]
        if c.isdigit():
            has_digit = True
        elif c.isalpha():
            if c.isupper():
                has_big = True
            else:
                has_small = True
                c = c.upper()
            c = convert_c(c)
        password_copy += c
    
    assert has_small and has_big
    assert has_digit

    assert password_copy.find('ЙЦУ') == -1
    assert password_copy.find('ЦУК') == -1
    assert password_copy.find('УКЕ') == -1
    assert password_copy.find('КЕН') == -1
    assert password_copy.find('ЕНГ') == -1
    assert password_copy.find('НГШ') == -1
    assert password_copy.find('ГШЩ') == -1
    assert password_copy.find('ШЩЗ') == -1
    assert password_copy.find('ЩЗХ') == -1
    assert password_copy.find('ЗХЪ') == -1
    assert password_copy.find('ФЫВ') == -1
    assert password_copy.find('ЫВА') == -1
    assert password_copy.find('ВАП') == -1
    assert password_copy.find('АПР') == -1
    assert password_copy.find('ПРО') == -1
    assert password_copy.find('РОЛ') == -1
    assert password_copy.find('ОЛД') == -1
    assert password_copy.find('ЛДЖ') == -1
    assert password_copy.find('ДЖЭ') == -1
    assert password_copy.find('ЖЭЁ') == -1
    assert password_copy.find('ЯЧС') == -1
    assert password_copy.find('ЧСМ') == -1
    assert password_copy.find('СМИ') == -1
    assert password_copy.find('МИТ') == -1
    assert password_copy.find('ИТЬ') == -1
    assert password_copy.find('ТЬБ') == -1
    assert password_copy.find('ЬБЮ') == -1

    return 'ok'


try:
    password = input()
    check_password(password)
    print('ok')
except AssertionError as e:
    print('error')
except Exception as e:
    print('error')