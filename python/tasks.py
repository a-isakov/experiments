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

def convert_to_dec(n, s):
    res = 0
    for i in range(len(n)):
        res += n[i]*(s**i)
    return res

n1 = [2, 5, 1, 3, 1]
# print(convert_to_dec(n1, 16))
# print(int('13152', 16))
# n2 = [5, 2, x, 7]
counter = 0
for x in range(6, 100):
    n2 = [5, 2]
    n2.append(x)
    n2.append(7)
    if (convert_to_dec(n1, x) + convert_to_dec(n2, 100)) % 11 == 0:
        counter += 1
print(counter)