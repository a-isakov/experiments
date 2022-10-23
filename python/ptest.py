# from random import randint
# n, m = 2, 3
# a = [[randint(1, 100) for j in range(m)] for i in range(n)]
# print(a)
# # row_maxs = []
# # for i in range(n):
# #     row_maxs.append(max(a[i]))
# # col_mins = []
# # for i in range(m):
# #     col = []
# #     for j in range(n):
# #         col.append(a[j][i])
# #     # print(col)
# #     col_mins.append(min(col))
# # # print(row_maxs, col_mins)
# # print('---')
# # found = False
# # for i in range(n):
# #     for j in range(m):
# #         element = a[i][j]
# #         a_min = col_mins[j]
# #         a_max = row_maxs[i]
# #         if element == a_min and element == a_max:
# #             print(element, ': ', i, j)
# #             found = True
# # if found == False:
# #     print(0)


from random import randint
n = 5
answer_list = []
a = [[randint(1, 6) for j in range(n)] for i in range(n)]
for i in range(n):
    print(a[i])
for i in range(n - 1):
    sum1 = 0
    sum2 = 0
    for j in range(n - i - 1):
        sum1 += a[j][i + j + 1]
        # print(a[j][i + j + 1])
        sum2 += a[i + j + 1][j]
        # print(a[i + j + 1][j])
    print(sum1, sum2)
    print('--')
