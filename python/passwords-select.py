# Напишите программу, которая будет требовать у пользователя ввода нового пароля до тех пор, пока не будет введен корректный,
# либо пока пользователь не прекратит программу с клавиатуры, то есть нажмет комбинацию клавиш Ctrl-Break или аналогичную ей.
# Критерии правильности пароля аналогичны критериям из задачи "Пароли часть 2" из классной работы.
# Если пользователь вводит неправильный пароль, то необходимо вывести имя класса того типа исключения, который будет "выброшен"
# вашей программой. После этого ввод продолжается.
# Если пользователь прерывает работу программы "волшебной" комбинацией клавиш, то надо вывести фразу Bye-Bye и сразу же завершить
# работу программы.
# Если пользователь вводит текст Ctrl+Break, то программа должна искусственно сымитировать нажатие "волшебной" комбинации клавиш.
# Как только будет введен правильный пароль следует вывести ok и тотчас же прекратить выполнение программы.

# Пример 1
# Ввод	Вывод
# 12345
# amsndbashgdwgehd
# qweasdzxc1Z
# U1S6OTeEпьdъТ3
# LengthError
# LetterError
# SequenceError
# ok
# Пример 2
# Ввод	Вывод
# abcd
# abcdefghyvb
# Abcdefghyvb8
# Ctrl+Break
# LengthError
# LetterError
# SequenceError
# Bye-Bye
# Пример 3
# Ввод	Вывод
# Ctrl+Break
# Bye-Bye

class LengthError(ValueError):
    pass


class LetterError(ValueError):
    pass


class DigitError(ValueError):
    pass


class SequenceError(ValueError):
    pass


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
        raise LengthError

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
    
    if not (has_small and has_big):
        raise LetterError

    if not has_digit:
        raise DigitError

    if password_copy.find('ЙЦУ') != -1:
        raise SequenceError
    if password_copy.find('ЦУК') != -1:
        raise SequenceError
    if password_copy.find('УКЕ') != -1:
        raise SequenceError
    if password_copy.find('КЕН') != -1:
        raise SequenceError
    if password_copy.find('ЕНГ') != -1:
        raise SequenceError
    if password_copy.find('НГШ') != -1:
        raise SequenceError
    if password_copy.find('ГШЩ') != -1:
        raise SequenceError
    if password_copy.find('ШЩЗ') != -1:
        raise SequenceError
    if password_copy.find('ЩЗХ') != -1:
        raise SequenceError
    if password_copy.find('ЗХЪ') != -1:
        raise SequenceError
    if password_copy.find('ФЫВ') != -1:
        raise SequenceError
    if password_copy.find('ЫВА') != -1:
        raise SequenceError
    if password_copy.find('ВАП') != -1:
        raise SequenceError
    if password_copy.find('АПР') != -1:
        raise SequenceError
    if password_copy.find('ПРО') != -1:
        raise SequenceError
    if password_copy.find('РОЛ') != -1:
        raise SequenceError
    if password_copy.find('ОЛД') != -1:
        raise SequenceError
    if password_copy.find('ЛДЖ') != -1:
        raise SequenceError
    if password_copy.find('ДЖЭ') != -1:
        raise SequenceError
    if password_copy.find('ЖЭЁ') != -1:
        raise SequenceError
    if password_copy.find('ЯЧС') != -1:
        raise SequenceError
    if password_copy.find('ЧСМ') != -1:
        raise SequenceError
    if password_copy.find('СМИ') != -1:
        raise SequenceError
    if password_copy.find('МИТ') != -1:
        raise SequenceError
    if password_copy.find('ИТЬ') != -1:
        raise SequenceError
    if password_copy.find('ТЬБ') != -1:
        raise SequenceError
    if password_copy.find('ЬБЮ') != -1:
        raise SequenceError

    return 'ok'


password_is_good = False
while not password_is_good:
    try:
        password = input()
        if password == 'Ctrl+Break':
            print('Bye-Bye')
            raise KeyboardInterrupt
            # break
        check_password(password)
        print('ok')
        password_is_good = True
    # except KeyboardInterrupt:
    #     print('Bye-Bye')
    #     break
    except Exception as error:
        print(error.__class__.__name__)