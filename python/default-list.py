# Попробуйте создать класс DefaultList, наследуемый от обычного списка.

# DefaultList не должен выбрасывать исключения IndexError в случае выхода за свои границы, а будет возвращать значение по умолчанию,
# которое должно быть передано в метод __init__. Для переопределения действий взятия по индексу нужно работать с методом __getitem__.
# В переопределенном __getitem__ будет производиться отлавливание исключения IndexError и если исключение возникнет, будет возвращено
# значение по умолчанию.
# Подумайте, где может быть полезен такой тип списка.

# Например:

# >>> s = DefaultList(0)  
# >>> s[3434]  
# 0
# Пример 1
# Ввод	Вывод
# from solution import DefaultList

# s = DefaultList(5)
# s.extend([4, 10])

# indexes = [1, 124, 1882]
# for i in indexes:
#     print(s[i], end=" ")
# 10 5 5
# Пример 2
# Ввод	Вывод
# from solution import DefaultList

# s = DefaultList(51)
# s.extend([1, 5, 7])

# indexes = [0, 2, 1000, -1]
# for i in indexes:
#     print(s[i], end=" ")
# 1 7 51 7

class DefaultList(list):
    default_value = 0

    def __init__(self, default_value):
        super().__init__()
        self.default_value = default_value

    def __getitem__(self, key):
        try:
            item = super().__getitem__(key)
            return item
        except IndexError:
            return self.default_value

# s = DefaultList(5)
# s.extend([4, 10])

# indexes = [1, 124, 1882]
# for i in indexes:
#     print(s[i], end=" ")

# s = DefaultList(51)
# s.extend([1, 5, 7])

# indexes = [0, 2, 1000, -1]
# for i in indexes:
#     print(s[i], end=" ")