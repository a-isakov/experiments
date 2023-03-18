k = 0
for i in range(1, 1001):
    bin_i = str(bin(i)[2:])
    if bin_i.count('1') % 2 == 0:
        bin_i1 = bin_i[1:]
        bin_i1 = bin_i1.replace('0', '')
    else:
        bin_i1 = bin_i.replace('0', '')
        bin_i1 += '1'

    if bin_i1.count('1') % 2 == 0:
        bin_i2 = bin_i1[1:]
        bin_i2 = bin_i2.replace('0', '')
    else:
        bin_i2 = bin_i1.replace('0', '')
        bin_i2 += '1'
    r = int(bin_i2, 2)
    print(i, bin_i, bin_i1, bin_i2, r)
    if r == 7:
        k += 1

print(k)