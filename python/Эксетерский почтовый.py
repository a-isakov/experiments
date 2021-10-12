# Напишите функцию find_train() для поиска поезда. Функция принимает произвольное число кортежей целых чисел, а возвращает упорядоченный список наибольших двузначных чисел из каждого кортежа без повторений.

# Если в кортеже все значения одинаковы, то возбуждается собственное исключение SameValuesError с сообщением Same values in tuple.

# Если в кортеже встречаются отрицательные значения или ноль, вызывается стандартное исключение ArithmeticError с сообщением Incorrect value.

# Если подходящих чисел не нашлось, то нужно вызвать стандартное исключение NameError с сообщением Empty result.

# Пример 1
# Ввод	Вывод
# data = [(15, 114, 68, 85, 87, 1, 16),
#        (30, 88, 23, 73, 154),
#        (100, 91, 165, 152, 1, 38)]
# print(*find_train(*data))
# 87 88 91
# Пример 2
# Ввод	Вывод
# data = [(82, 82, 82, 82, 82),
#        (184, 49, 52, 82, 178)]
# print(*find_train(*data))
# SameValuesError: Same values in tuple
# Пример 3
# Ввод	Вывод
# data = [(504, 118, 161, 115, 171, 318),
#        (4, 1, 6, 1, 157), (182, 121)]
# print(*find_train(*data))
# NameError: Empty result
# Пример 4
# Ввод	Вывод
# data = [(141, 318), (4, -5), (182, 121)]
# print(*find_train(*data))
# ArithmeticError: Incorrect value
# Примечания
# Задача написанной вами функции – возвращать результат или порождать исключения, перехватывать их будет тестирующая система.

class SameValuesError(ValueError):
    pass


def find_train(*data):
    result = list()
    has_result = False
    for t in data:
        max = 0
        check_set = set()
        for n in t:
            if n <= 0:
                raise ArithmeticError('Incorrect value')
            if n > max and n >= 10 and n < 100:
                max = n
                has_result = True
            check_set.add(n)
        if len(check_set) == 1:
            raise SameValuesError('Same values in tuple')
        result.append(max)
    if not has_result:
        raise NameError('Empty result')
    return result


# data = [(15, 114, 68, 85, 87, 1, 16),
#        (30, 88, 23, 73, 154),
#        (100, 91, 165, 152, 1, 38)]
# print(*find_train(*data))

data = [(141, 318), (4, -5), (182, 121)]
print(*find_train(*data))

# data = [(504, 118, 161, 115, 171, 318),
#        (4, 1, 6, 1, 157), (182, 121)]
# print(*find_train(*data))

# data = [(82, 82, 82, 82, 82),
#        (184, 49, 52, 82, 178)]
# print(*find_train(*data))
