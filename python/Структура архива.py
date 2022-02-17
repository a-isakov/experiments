# import os
from zipfile import ZipFile


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


def print_item(key, value, level):
    if isinstance(value, dict):
        result = '  ' * level + key
        print(result)
        for subkey, subvalue in value.items():
            print_item(subkey, subvalue, level + 1)
    elif key != '':
        result = '  ' * level + key + ' ' + human_read_format(value)
        print(result)


def append_item(item, struct, size):
    index = item.find('/')
    if index == -1:
        struct[item] = size
    else:
        folder = item[:index]
        if folder not in struct.keys():
            struct[folder] = dict()
        append_item(item[index + 1:], struct[folder], size)


structure = dict()
with ZipFile('input.zip') as myzip:
    items = myzip.namelist()
    # print(items)
    for item in items:
        info = myzip.getinfo(item)
        # print(info.file_size)
        append_item(item, structure, info.file_size)
    # print(structure)
    for key, value in structure.items():
        print_item(key, value, 0)
