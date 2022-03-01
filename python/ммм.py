import sys
import json


res = dict()
spisok = []
new_dict = {}
for el in sys.stdin:
    k, v, n = el.strip().split(":")
    if k not in res.keys():
        res[k] = dict()
    if n not in res[k].keys():
        res[k][n] = []
    res[k][n].append(v)

for items in res:
    for s in items:
        s.sort()
print(res)


with open("riddle.json", "w") as f:
    # json.dump(res, f, indent=4, sort_keys=True)
    json.dump(res, f, indent=4)