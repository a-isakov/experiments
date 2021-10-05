phone_num = input().strip()
error = False
first_parenthese = False
second_parenthese = False
result = ''
digits = 0
if len(phone_num) < 2:
    error = True
else:
    if phone_num[0] == '8':
        digits += 1
        phone_num = phone_num[1:]
        result = '+7'
    elif phone_num[:2] == '+7':
        digits += 1
        phone_num = phone_num[2:]
        result = '+7'
    else:
        error = True

if not error:
    for i in range(len(phone_num)):
        c = phone_num[i]
        if ord(c) >= 48 and ord(c) <= 57:
            result += c
            digits += 1
        elif c == ' ' or c == '\t':
            continue
        elif c == '-':
            if i == len(phone_num) - 1:
                error = True
                break
            elif phone_num[i - 1] == '-':
                error = True
                break
        elif c == '(':
            if first_parenthese or second_parenthese:
                error = True
                break
            first_parenthese = True
        elif c == ')':
            if not first_parenthese or second_parenthese:
                error = True
                break
            second_parenthese = True
        else:
            error = True
            break

if digits != 11:
    error = True

if first_parenthese and not second_parenthese:
    error = True
elif not first_parenthese and second_parenthese:
    error = True

if error:
    print('error')
else:
    print(result)