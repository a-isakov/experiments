# На этом уроке мы работаем с паролями пользователя. Всем известно, что пароли бывают хорошими и плохими.
# Запишем критерии хорошего пароля:
# Длина пароля больше 8 символов.
# В нем присутствуют большие и маленькие буквы любого алфавита.
# В нем имеется хотя бы одна цифра.
# В пароле нет ни одной комбинации из 3 буквенных символов, стоящих рядом в строке клавиатуры независимо от того,
# русская раскладка выбрана или английская.
# Например, недопустимы , «QwE», «TYU», «йцу», «Hjk», «ЛДЖ» и т.д. А «QWу», «хъф» и т.д. — вполне подходят.
# Причем, надо учесть как раскладку PC-совместимых компьютеров, так и раскладку MAC’ов.
# Напишите программу в стиле LBYL для работы с паролем пользователя. На вход подается пароль, а на выход возвращается «ok»,
# если пароль соответствует всем критериям, или «error» в ином случае.

# Пример 1
# Ввод	Вывод
# GБвИНddифпГxFGH
# error
# Пример 2
# Ввод	Вывод
# 41157082
# error
# Пример 3
# Ввод	Вывод
# Еpert
# error

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
    if len(password) <= 8:
        raise ValueError('error')

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
    if not (has_small and has_big and has_digit):
        raise ValueError('error')

    if password_copy.find('ЙЦУ') != -1:
        raise ValueError('error')
    if password_copy.find('ЦУК') != -1:
        raise ValueError('error')
    if password_copy.find('УКЕ') != -1:
        raise ValueError('error')
    if password_copy.find('КЕН') != -1:
        raise ValueError('error')
    if password_copy.find('ЕНГ') != -1:
        raise ValueError('error')
    if password_copy.find('НГШ') != -1:
        raise ValueError('error')
    if password_copy.find('ГШЩ') != -1:
        raise ValueError('error')
    if password_copy.find('ШЩЗ') != -1:
        raise ValueError('error')
    if password_copy.find('ЩЗХ') != -1:
        raise ValueError('error')
    if password_copy.find('ЗХЪ') != -1:
        raise ValueError('error')
    if password_copy.find('ФЫВ') != -1:
        raise ValueError('error')
    if password_copy.find('ЫВА') != -1:
        raise ValueError('error')
    if password_copy.find('ВАП') != -1:
        raise ValueError('error')
    if password_copy.find('АПР') != -1:
        raise ValueError('error')
    if password_copy.find('ПРО') != -1:
        raise ValueError('error')
    if password_copy.find('РОЛ') != -1:
        raise ValueError('error')
    if password_copy.find('ОЛД') != -1:
        raise ValueError('error')
    if password_copy.find('ЛДЖ') != -1:
        raise ValueError('error')
    if password_copy.find('ДЖЭ') != -1:
        raise ValueError('error')
    if password_copy.find('ЖЭЁ') != -1:
        raise ValueError('error')
    if password_copy.find('ЯЧС') != -1:
        raise ValueError('error')
    if password_copy.find('ЧСМ') != -1:
        raise ValueError('error')
    if password_copy.find('СМИ') != -1:
        raise ValueError('error')
    if password_copy.find('МИТ') != -1:
        raise ValueError('error')
    if password_copy.find('ИТЬ') != -1:
        raise ValueError('error')
    if password_copy.find('ТЬБ') != -1:
        raise ValueError('error')
    if password_copy.find('ЬБЮ') != -1:
        raise ValueError('error')


try:
    password = input()
    check_password(password)
    print('ok')
except ValueError as e:
    print(e)