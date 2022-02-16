# import os
from zipfile import ZipFile


def print_item(key, value, level):
    if isinstance(value, dict):
        result = '  ' * level + key
        print(result)
        for subkey, subvalue in value.items():
            print_item(subkey, subvalue, level + 1)
    elif key != '':
        result = '  ' * level + key
        print(result)


def append_item(item, struct):
    index = item.find('/')
    if index == -1:
        struct[item] = 'file'
    else:
        folder = item[:index]
        if folder not in struct.keys():
            struct[folder] = dict()
        append_item(item[index + 1:], struct[folder])


structure = dict()
with ZipFile('input.zip') as myzip:
    items = myzip.namelist()
    # print(items)
    for item in items:
        append_item(item, structure)
    # print(structure)
    for key, value in structure.items():
        print_item(key, value, 0)
