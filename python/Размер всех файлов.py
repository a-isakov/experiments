import os


def human_read_format(size):
    inpt = size
    inpt_copy = inpt
    k = 0
    byte = 1024
    if inpt / byte > 1:
        inpt_copy = inpt / byte
        k += 1
        answer = round(inpt_copy)
        if inpt_copy / byte > 1:
            k += 1
            inpt_copy = inpt_copy / byte
            answer = round(inpt_copy)
            if inpt_copy / byte > 1:
                k += 1
                inpt_copy = inpt_copy / byte
                answer = round(inpt_copy)
    if k == 0:
        final_answer = str(inpt) + 'Б'
        return(final_answer)
    if k == 1:
        final_answer = str(answer) + 'КБ'
        return (final_answer)
    if k == 2:
        final_answer = str(answer) + 'МБ'
        return (final_answer)
    if k == 3:
        final_answer = str(answer) + 'ГБ'
        return (final_answer)


def get_files_sizes():
    items = os.listdir()
    result = ''
    for item in items:
        if os.path.isfile(item):
            size = os.path.getsize(item)
            # print(item)
            result += item + ' ' + human_read_format(size) + '\n'
    # print(result[:-1])
    return result[:-1]


# get_files_sizes()