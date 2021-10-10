# Напишите функцию reverse(), которая побайтно читает бинарные данные из файла input.dat и создает файл output.dat, куда сохраняет
# прочитанные данные в обратном порядке.

# Примечания
# Постарайтесь решить эту задачу без использования циклов.

# В тестирующую систему надо отправить решение, содержащее только функцию reverse().

def reverse():
    fr = open('input.dat', mode='rb')
    fw = open('output.dat', mode='wb')
    data = fr.read()
    result = []
    for i in range(len(data)):
        result.append(data[len(data) - i - 1])
    fw.write(bytes(result))
    fr.close()
    fw.close()