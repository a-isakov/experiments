module sample
import StdEnv


/*int2str :: Int -> String
int2str 0 = "zero"
int2str 1 = "one"
int2str 2 = "two"
int2str 3 = "three"
int2str 4 = "four"
int2str 5 = "five"
int2str 6 = "six"
int2str 7 = "seven"
int2str 8 = "eight"
int2str 9 = "nine"


intString :: Int -> String 
intString n
| (n < 10)  = (int2str n)
| otherwise = (intString (n / 10) +++ "-" +++ int2str (n rem 10))


Start = intString 432
*/

/***** Please leave this block untouched *****/

charToString :: String -> [Char]
charToString str = fromString str

zeroAll ls = map (\x = 0) ls
oneAll ls = map (\x = 1) ls
doubleAll ls = map (\x = x*2) ls
tripleAll ls = map (\x = x*3) ls
halfAll ls = map (\x = x/2) ls
sqAll ls = map (\x = x^2) ls

falseAll ls = map (\x = False) ls
trueAll ls = map (\x = True) ls
trueFalse ls = [ result index \\ x <- ls & index <- [0..] ] where result index | isEven index = True = False

zeroStrAll ls = map (\x = "0") ls
oneStrAll ls = map (\x = "1") ls
falseStrAll ls = map (\x = "False") ls
trueStrAll ls = map (\x = "True") ls
/**********************************************/
/*
isOddAscii :: Char -> Bool 
isOddAscii c = toInt c rem 2 == 1 
 
 
sumOddChar :: String -> Int 
sumOddChar str 
    = sum [toInt c \\ c <- charToString str | not (isOddAscii c)]
*/
/*
 2. Given a list of function and a 2 dimensional list of integer. 
	Apply the  first function to the LAST sublist and the second function to the SECOND LAST sublist, and so on.
	
	[func1, func2, func3, func4] [[1,2,3,4][5,6,7,8][9,1,0,1,1,1,2],[4,9,2,3]]
	Result -> [func1 [4,9,2,3], func2 [9,1,0,1,1,1,2], func3 [5,6,7,8], func4 [1,2,3,4]]
*/


applyFunctions :: [([Int] -> [a])] [[Int]] -> [[a]]
applyFunctions fs lss = [f ls \\ f <- fs & ls <- reverse lss]


Start = applyFunctions [ zeroAll, oneAll, doubleAll, tripleAll, halfAll, sqAll ] [[42,17],[33],[21,95,8,62,30],[77,9,4],[],[50,68,22,91]]
// [[0,0,0,0],[],[154,18,8],[63,285,24,186,90],[16],[1764,289]]

//Start = applyFunctions [ falseAll, trueAll, trueFalse, trueFalse, trueAll, falseAll ] [[42,17],[33],[21,95,8,62,30],[77,9,4],[],[50,68,22,91]]
//[[False,False,False,False],[],[True,False,True],[True,False,True,False,True],[True],[False,False]]

//Start = applyFunctions [ zeroStrAll, oneStrAll, falseStrAll, trueStrAll, zeroStrAll, oneStrAll ] [[42,17],[33],[21,95,8,62,30],[77,9,4],[],[50,68,22,91]]
// [["0","0","0","0"],[],["False","False","False"],["True","True","True","True","True"],["0"],["1","1"]]

