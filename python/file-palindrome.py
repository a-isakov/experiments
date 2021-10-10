# Центральную симметрию можно найти во многих областях. Давайте поищем ее в файлах. Напишите функцию palindrome(), которая
# проверяет бинарный файл input.dat на палиндром. Если файл является палиндромом, то функция должна вернуть истину, в противном
# случае — ложь.

# Примечания
# В тестирующую систему необходимо отправить решение содержащее только функцию palindrome().

def palindrome():
    result = True
    fr = open('input.dat', mode='rb')
    data = fr.read()
    for i in range(len(data) // 2):
        if data[len(data) - i - 1] != data[i]:
            result = False
            break
    fr.close()
    return result