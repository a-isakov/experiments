# k = 0
# for i in range(1, 1001):
#     bin_i = str(bin(i)[2:])
#     if bin_i.count('1') % 2 == 0:
#         bin_i1 = bin_i[1:]
#         bin_i1 = bin_i1.replace('0', '')
#     else:
#         bin_i1 = bin_i.replace('0', '')
#         bin_i1 += '1'

#     if bin_i1.count('1') % 2 == 0:
#         bin_i2 = bin_i1[1:]
#         bin_i2 = bin_i2.replace('0', '')
#     else:
#         bin_i2 = bin_i1.replace('0', '')
#         bin_i2 += '1'
#     r = int(bin_i2, 2)
#     print(i, bin_i, bin_i1, bin_i2, r)
#     if r == 7:
#         k += 1

# print(k)

# def convert_to_dec(n, s):
#     res = 0
#     for i in range(len(n)):
#         res += n[i]*(s**i)
#     return res

# n1 = [2, 5, 1, 3, 1]
# # print(convert_to_dec(n1, 16))
# # print(int('13152', 16))
# # n2 = [5, 2, x, 7]
# counter = 0
# for x in range(6, 100):
#     n2 = [5, 2]
#     n2.append(x)
#     n2.append(7)
#     if (convert_to_dec(n1, x) + convert_to_dec(n2, 100)) % 11 == 0:
#         counter += 1
# print(counter)

# n1 = [ord('Z')- ord('A') + 10, a, ord('Y')- ord('A') + 10, ord('X')- ord('A') + 10]
# n2 = [2, ord('X')- ord('A') + 10, a, ord('Y')- ord('A') + 10]
# result_array = []
# for a in range(55):
#     n1 = [33, 34, a, 35]
#     n2 = [34, a, 33, 2]
#     res = convert_to_dec(n1, 55) - convert_to_dec(n2, 55)
#     if res % 29 == 0:
#         result_array.append(a)

# min_a = min(result_array)
# print('min a =', min_a)

# n1 = [33, 34, min_a, 35]
# n2 = [34, min_a, 33, 2]
# r1 = abs(convert_to_dec(n1, 55) - convert_to_dec(n2, 55))
# print(r1) # ZaYX55 –  2XaY55

# max_a = max(result_array)
# print('max a =', max_a)

# n1 = [33, 34, max_a, 35]
# n2 = [34, max_a, 33, 2]
# r2 = abs(convert_to_dec(n1, 55) - convert_to_dec(n2, 55))
# print(r2) # ZaYX55 –  2XaY55

# result = abs(r1 - r2)
# print(result)

res = set()
alphabet = 'ABCDEF'
for c1 in range(len(alphabet)):
    for c2 in range(len(alphabet)):
        if c1 == c2:
            continue
        for c3 in range(len(alphabet)):
            if c1 == c3 or c2 == c3:
                continue
            for c4 in range(len(alphabet)):
                if c1 == c4 or c2 == c4 or c3 == c4:
                    continue
                # if alphabet[c1] == alphabet[c2] or alphabet[c2] == alphabet[c3] or alphabet[c3] == alphabet[c4]:
                #     continue
                word = alphabet[c1] + alphabet[c2] + alphabet[c3] + alphabet[c4]
                res.add(word)
print(len(res))
