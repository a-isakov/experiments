import numpy as np

def normalize_matrix(mtx):
    # Произведите нормировку матрицы из предыдущего задания:
    # вычтите из каждого столбца его среднее значение, а затем поделите на его стандартное отклонение
    m = np.mean(x, axis=0)
    #print(m)
    std = np.std(x, axis=0)
    #print(std)
    normalized = (x - m) / std
    #print(normalized)
    return normalized

# Сгенерируйте матрицу, состоящую из 1000 строк и 50 столбцов, элементы которой являются случайными
# из нормального распределения N(1,100).
x = np.random.normal(loc=1, scale=10, size=(3, 4))
#print(x)
#print(normalize_matrix(x))

# Выведите для заданной матрицы номера строк, сумма элементов в которых превосходит 10
Z = np.array([[4, 5, 0], 
             [1, 9, 3],              
             [5, 1, 1],
             [3, 3, 3], 
             [9, 9, 9], 
             [4, 7, 1]])
summed_rows = np.sum(Z, axis = 1)
#print(np.nonzero(summed_rows > 10))

# Сгенерируйте две единичные матрицы (т.е. с единицами на диагонали) размера 3x3. Соедините две матрицы в одну размера 6x3.
a = np.eye(3)
b = np.eye(3)
#print(np.vstack((a, b)))