import math
import json

def inputInt(valueName):
	while True:
		print("Enter " + valueName + " value:")
		try:
			retValue = int(input())
			return retValue
		except:
			print("Should be int")

#a = inputInt("lower multiplier")
#b = inputInt("upper multiplier")
def countWordsCount():
	s = str(input("Enter some text: "))
	sRep = ""
	while True:
		sRep = s.replace("  ", " ", -1)
		if s == sRep:
			break
		else:
			s = sRep
	#if s[-1] == " ": s = s[:len(s) - 1]
	if s[-1] == " ": s = s[:-1]
	a = s.split(" ")
	print("Words count:", len(a))
	for i in range(len(a)):
		print(a[i])

def dictSortExample():
	rmp = {}
	rmp["10.5"] = 30
	rmp["10.7"] = 40
	rmp["10.1"] = 90
	rmp["10.3"] = 20
	print(rmp)
	print(sorted(rmp, key = rmp.__getitem__))
	lst = rmp.items()
	print(lst)
	print(sorted(lst, key = lambda keySort: keySort[1]))

def printDict():
	dic = {'John':1200, 'Paul':1000, 'Jones':1850, 'Dorothy': 950}
	print("\n".join(["%s = %d" % (name, salary) for name, salary in dic.items()]))

def printDictTree(dicts, level = 0):
	for item in dicts.items():
		if type(item[1]) is not dict:
			print("  "*level, item[0], ":", item[1])
		else:
			print("  "*level, item[0], ":")
			printDictTree(item[1], level + 1)

# h1 = {1:"one", 2:"two", 3:"three", 4:{"a":"b", 5:{"qw":"er", "as":"zx"}}}
# printDictTree(h1)
# print(len(h1))

# a = 2
# b = 3
# f = lambda a, b : int(math.pow(a, b))
# print(a, b, f(a, b))

printDict()