# В одной папке с Вашей программой лежит файл cyrillic.txt.
# В нем в числе прочих содержится некоторое количество кириллических символов.
# Вам требуется провести транслитерацию, то есть заменить все кириллические символы на латинские в соответствии с предложенной
# таблицей (все остальные символы надо оставить без изменений) и записать результат во второй файл: transliteration.txt.

# Таблица замен:

#    "й": "j", "ц": "c", "у": "u", "к": "k", "е": "e", "н": "n",  
#    "г": "g", "ш": "sh", "щ": "shh", "з": "z", "х": "h", "ъ": "#",  
#    "ф": "f", "ы": "y", "в": "v", "а": "a", "п": "p", "р": "r",  
#    "о": "o", "л": "l", "д": "d", "ж": "zh", "э": "je", "я": "ya",  
#    "ч": "ch", "с": "s", "м": "m", "и": "i", "т": "t", "ь": "'",  
#    "б": "b", "ю": "ju", "ё": "jo"

# Обратите внимание, что заглавные буквы должны заменяться на соответствующие им заглавные же буквы, но если транслитерационная
# последовательность состоит из нескольких символов, то заглавным будет только первый из них.
# Например, «В» на «V», а «Щ» на «Shh».

# Пример 1
# Ввод	Вывод
# Привет, как у тебя дела?
# Privet, kak u tebya dela?
# Пример 2
# Ввод	Вывод
# Президент США Дональд Трамп продолжил обмен выпадами с
# руководством КНДР. В своем Twitter, комментируя выступление
# главы северокорейского МИДа Ли Ён Хо, американский лидер заявил,
# что если министр говорил от имени своего государства,
# то это означает, что КНДР долго не просуществует.

# Just heard Foreign Minister of North Korea speak at U.N.
# If he echoes thoughts of Little Rocket Man,
# they won't be around much longer!
# Prezident SShA Donal'd Tramp prodolzhil obmen vypadami s
# rukovodstvom KNDR. V svoem Twitter, kommentiruya vystuplenie
# glavy severokorejskogo MIDa Li Jon Ho, amerikanskij lider zayavil,
# chto esli ministr govoril ot imeni svoego gosudarstva,
# to jeto oznachaet, chto KNDR dolgo ne prosushhestvuet.

# Just heard Foreign Minister of North Korea speak at U.N.
# If he echoes thoughts of Little Rocket Man,
# they won't be around much longer!

def convert(line):
    replace_table = dict()
    replace_table['а'] = 'a'
    replace_table['б'] = 'b'
    replace_table['в'] = 'v'
    replace_table['г'] = 'g'
    replace_table['д'] = 'd'
    replace_table['е'] = 'e'
    replace_table['ё'] = 'jo'
    replace_table['ж'] = 'zh'
    replace_table['з'] = 'z'
    replace_table['и'] = 'i'
    replace_table['й'] = 'j'
    replace_table['к'] = 'k'
    replace_table['л'] = 'l'
    replace_table['м'] = 'm'
    replace_table['н'] = 'n'
    replace_table['о'] = 'o'
    replace_table['п'] = 'p'
    replace_table['р'] = 'r'
    replace_table['с'] = 's'
    replace_table['т'] = 't'
    replace_table['у'] = 'u'
    replace_table['ф'] = 'f'
    replace_table['х'] = 'h'
    replace_table['ц'] = 'c'
    replace_table['ч'] = 'ch'
    replace_table['ш'] = 'sh'
    replace_table['щ'] = 'shh'
    replace_table['ъ'] = '#'
    replace_table['ы'] = 'y'
    replace_table['ь'] = '\''
    replace_table['э'] = 'je'
    replace_table['ю'] = 'ju'
    replace_table['я'] = 'ya'
    result = ''
    for c in line:
        is_upper = c.isupper()
        c1 = c.lower()
        if c1 in replace_table.keys():
            c2 = replace_table[c1]
            if is_upper:
                c2 = c2.capitalize()
            result += c2
        else:
            result += c
    return result


fr = open('cyrillic.txt', encoding="utf-8")
fw = open('transliteration.txt', mode='w', encoding="utf-8")
for number, line in enumerate(fr):
    translit = convert(line)
    fw.write(translit)
fr.close()
fw.close()