module HW2
import StdEnv

/*
 1. Given a positive integer, 
	find the summation of the odd digits 
	of the given number.
*/
helpOddDigits :: Int Int -> Int 
helpOddDigits n counter  
| n < 10 && (n rem 2) == 1  = (counter + n) 
| n < 10 && (n rem 2) == 0  = (counter) 
| ((n rem 10) rem 2 == 1) = helpOddDigits (n/10) (counter + n rem 10) 
= helpOddDigits (n/10) (counter) 
 
 
oddDigits :: Int -> Int 
oddDigits n = helpOddDigits n 0


//Start = oddDigits 1589	// 15
//Start = oddDigits 8430 // 
//Start = oddDigits 0 // 0
//Start = oddDigits 12345 // 9

/*
 2. Given a natural number, transform it into string representation.
	eg. 4342 -> "four-three-four-two"
*/
/*
digits :: Int [Int] -> [Int] 
digits 0 x = x
digits n x = digits (n/10) [n rem 10: x]

useful :: Int -> String
useful n = 


intString :: Int -> [Int]
intString n = digits n [Int]


Start = intString 4342




/*

helpInt :: Int [Int] -> [Int]
helpInt 0 x = x
helpInt n x = helpInt (n/10) [n rem 10 : x]



Using :: Int String -> String 
Using chislo str 
| chislo > 10 = Using (n / 10) newStr (n rem 10)

intString :: Int -> String
intString n = Using n " "

//Start = hd [1, 2, 3, 4]
//Start = intString 4342// "four-three-four-two"
//Start = intString 7830 // "seven-eight-three-zero"
//Start = intString 000 // "zero"
//Start = intString 1010 // "one-zero-one-zero"


/*
| (n rem 10) == 1 && (n > 10) = helpInt (n/10) (stroka +++ "-one")
| (n rem 10) == 2 && (n > 10) = helpInt (n/10) (stroka +++ "-two")
| (n rem 10) == 3 && (n > 10) = helpInt (n/10) (stroka +++ "-three")
| (n rem 10) == 4 && (n > 10) = helpInt (n/10) (stroka +++ "-four")
| (n rem 10) == 5 && (n > 10) = helpInt (n/10) (stroka +++ "-five")
| (n rem 10) == 6 && (n > 10) = helpInt (n/10) (stroka +++ "-six")
| (n rem 10) == 7 && (n > 10) = helpInt (n/10) (stroka +++ "-seven")
| (n rem 10) == 8 && (n > 10) = helpInt (n/10) (stroka +++ "-eight")
| (n rem 10) == 9 && (n > 10) = helpInt (n/10) (stroka +++ "-nine")
| (n rem 10) == 0 && (n > 10) = helpInt (n/10) (stroka +++ "-zero")
| (n rem 10) == 1 = helpInt 0 (stroka +++ "one")
| (n rem 10) == 2 = helpInt 0 (stroka +++ "two")
| (n rem 10) == 3 = helpInt 0 (stroka +++ "three")
| (n rem 10) == 4 = helpInt 0 (stroka +++ "four")
| (n rem 10) == 5 = helpInt 0 (stroka +++ "five")
| (n rem 10) == 6 = helpInt 0 (stroka +++ "six")
| (n rem 10) == 7 = helpInt 0 (stroka +++ "seven")
| (n rem 10) == 8 = helpInt 0 (stroka +++ "eight")
| (n rem 10) == 9 = helpInt 0 (stroka +++ "nine")
| (n rem 10) == 0 = helpInt 0 (stroka +++ "zero")


intString :: Int -> String
intString n = helpInt n " "
*/
/*
helpInt :: Int String -> String
helpInt n stroka
| n == 0 = "zero"
| (n rem 10) == 1 && (n > 10) = helpInt (n / 10) (stroka +++ "-one")
| (n rem 10) == 2 && (n > 10) = helpInt (n / 10) (stroka +++ "-two")
| (n rem 10) == 3 && (n > 10) = helpInt (n / 10) (stroka +++ "-three")
| (n rem 10) == 4 && (n > 10) = helpInt (n / 10) (stroka +++ "-four")
| (n rem 10) == 5 && (n > 10) = helpInt (n / 10) (stroka +++ "-five")
| (n rem 10) == 6 && (n > 10) = helpInt (n / 10) (stroka +++ "-six")
| (n rem 10) == 7 && (n > 10) = helpInt (n / 10) (stroka +++ "-seven")
| (n rem 10) == 8 && (n > 10) = helpInt (n / 10) (stroka +++ "-eight")
| (n rem 10) == 9 && (n > 10) = helpInt (n / 10) (stroka +++ "-nine")
| (n rem 10) == 0 && (n > 10) = helpInt (n / 10) (stroka +++ "-zero")
helpInt 1 stroka = helpInt (n / 10) (stroka +++ "one")
helpInt 2 stroka = helpInt (n / 10) (stroka +++ "two")
helpInt 3 stroka = helpInt (n / 10) (stroka +++ "three")
helpInt 4 stroka = helpInt (n / 10) (stroka +++ "four")
helpInt 5 stroka = helpInt (n / 10) (stroka +++ "five")
helpInt 6 stroka = helpInt (n / 10) (stroka +++ "six")
helpInt 7 stroka = helpInt (n / 10) (stroka +++ "seven")
helpInt 8 stroka = helpInt (n / 10) (stroka +++ "eight")
helpInt 9 stroka = helpInt (n / 10) (stroka +++ "nine")
helpInt :: Int [Int] -> [Int]
helpInt 0 x = x
helpInt n x = helpInt (n/10) [n rem 10 : x]

helpFromArray :: [Int] String -> String
helpFromArray n stroka = 
| n == [] = ""
| hd n == 1  = helpFromArray (drop 1 n) (stroka +++ "one-")
| hd n == 2 = helpFromArray (drop 1 n) (stroka +++ "two-")
| hd n == 3 = helpFromArray (drop 1 n) (stroka +++ "three-")
| hd n == 4 = helpFromArray (drop 1 n) (stroka +++ "four-")
| hd n == 5 = helpFromArray (drop 1 n) (stroka +++ "five-")
| hd n == 6 = helpFromArray (drop 1 n) (stroka +++ "six-")
| hd n == 7 = helpFromArray (drop 1 n) (stroka +++ "seven-")
| hd n == 8 = helpFromArray (drop 1 n) (stroka +++ "eight-")
| hd n == 9 = helpFromArray (drop 1 n) (stroka +++ "nine-")
| hd n == 0 = helpFromArray (drop 1 n) (stroka +++ "zero-")


*/


//Start = intString 4342// "four-three-four-two"
//Start = intString 7830 // "seven-eight-three-zero"
//Start = intString 000 // "zero"
//Start = intString 1010 // "one-zero-one-zero"
*/