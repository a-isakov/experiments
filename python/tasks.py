# class Note:
#     note = None
    
#     def __init__(self, note, length=False):
#         if note == 'до':
#             if not length:
#                 self.note = 'до'
#             else:
#                 self.note = 'до-о'
#         elif note == 'ре':
#             if not length:
#                 self.note = 'ре'
#             else:
#                 self.note = 'ре-э'
#         elif note == 'ми':
#             if not length:
#                 self.note = 'ми'
#             else:
#                 self.note = 'ми-и'
#         elif note == 'фа':
#             if not length:
#                 self.note = 'фа'
#             else:
#                 self.note = 'фа-а'
#         elif note == 'соль':
#             if not length:
#                 self.note = 'соль'
#             else:
#                 self.note = 'со-оль'
#         elif note == 'ля':
#             if not length:
#                 self.note = 'ля'
#             else:
#                 self.note = 'ля-а'
#         elif note == 'си':
#             if not length:
#                 self.note = 'си'
#             else:
#                 self.note = 'си-и'
#         else:
#             self.note = ''

#     def __str__(self):
#         return self.note

# do_1 = Note('до', False)
# doo = Note('до', True)
# do_2 = Note('до')
# print(do_1, doo, do_2)

name = input()
name_2 = ''
name = name.lower()
for i in range(len(name)):
    if name[i] == 'а':
        name_2 += 'ка'
    elif name[i] == 'б':
        name_2 += 'зу'
    elif name[i] == 'в':
        name_2 += 'ру'
    elif name[i] == 'г':
        name_2 += 'джи'
    elif name[i] == 'д':
        name_2 += 'те'
    elif name[i] == 'е' or name[i] == 'ё':
        name_2 += 'ку'
    elif name[i] == 'ж':
        name_2 += 'зу'
    elif name[i] == 'з':
        name_2 += 'з'
    elif name[i] == 'и':
        name_2 += 'ки'
    elif name[i] == 'й':
        name_2 += 'фу'
    elif name[i] == 'к':
        name_2 += 'ме'
    elif name[i] == 'л':
        name_2 += 'та'
    elif name[i] == 'м':
        name_2 += 'рин'
    elif name[i] == 'н':
        name_2 += 'то'
    elif name[i] == 'о':
        name_2 += 'мо'
    elif name[i] == 'п':
        name_2 += 'но'
    elif name[i] == 'р':
        name_2 += 'ши'
    elif name[i] == 'с':
        name_2 += 'ари'
    elif name[i] == 'т':
        name_2 += 'чи'
    elif name[i] == 'у':
        name_2 += 'мей'
    elif name[i] == 'ф':
        name_2 += 'лу'
    elif name[i] == 'х':
        name_2 += 'ри'
    elif name[i] == 'ц':
        name_2 += 'ми'
    elif name[i] == 'ч':
        name_2 += 'зи'
    elif name[i] == 'ш':
        name_2 += 'ли'
    elif name[i] == 'щ':
        name_2 += 'ни'
    elif name[i] == 'ъ':
        name_2 += 'д'
    elif name[i] == 'ы':
        name_2 += 'хе'
    elif name[i] == 'ь':
        name_2 += 'ксе'
    elif name[i] == 'э':
        name_2 += 'га'
    elif name[i] == 'ю':
        name_2 += 'до'
    elif name[i] == 'я':
        name_2 += 'ма'
print(name_2.capitalize())
