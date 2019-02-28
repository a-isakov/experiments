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