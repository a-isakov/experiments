module HW1
import StdEnv


/* 
	1. Write lastDigitEvenOdd function which takes 1 integer and 
	returns the string "even" or "odd" of the second last digit of the given integer.
	If the given integer is 1 digit integer, then return "impossible"

	Ex: the given integer is 12345, and 
		then the function will examine if the second last digit is even or odd and return the respective string.
		In this case, 12345, second last digit is 4 in 12345, and 4 is even, so return "even".
		
		The given integer is 5856, then second last digit is 5 and it is odd, so return "odd".
		
		If the given integer is 5, then return "Impossible" as there is no second last digit.
	
	
*/
//lastDigitEvenOdd :: Int -> String
lastDigitEvenOdd :: Int -> String
lastDigitEvenOdd a
| abs(a) < 10 = "impossinle"
|((((abs(a) rem 100) - (abs(a) rem 10))/10) rem 2) == 0 = "even"
|((((abs(a) rem 100) - (abs(a) rem 10))/10) rem 2) == 1 = "odd"


//Start = lastDigitEvenOdd 12345	// "even"
//Start = lastDigitEvenOdd -12345	// "even"
//Start = lastDigitEvenOdd 5856		// "odd"
//Start = lastDigitEvenOdd 0		// "impossible"
//Start = lastDigitEvenOdd 5		// "impossible"
//Start = lastDigitEvenOdd -5		// "impossible"

/*
	2. Given an integer and a string,
	if the given string is "even", then check if the given integer is even.
	if the given string is "odd", then check if the given integer is odd.
	if the given string is none of the above, then return True.
*/

evenOdd :: Int String -> Bool
evenOdd a b 
|(((abs(a) rem 2) == 0) && (b == "even")) = True
|(((abs(a) rem 2) == 1) && (b == "even")) = False
|(((abs(a) rem 2) == 1) && (b == "odd")) = True
|(((abs(a) rem 2) == 0) && (b == "odd")) = False
|(not (b == "even") || (b == "odd")) = True


//Start = evenOdd 9 "even"  // False
//Start = evenOdd 7 "odd"   // True
//Start = evenOdd -8 "even" // True
//Start = evenOdd -5 "even" // False
//Start = evenOdd 0 "even"  // True
