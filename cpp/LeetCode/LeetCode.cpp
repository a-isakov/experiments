// LeetCode.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <vector>

#include "12 Integer to Roman.hpp"
void testIntToRoman()
{
	Solution sol;
	std::cout << "Test 1 " << std::string(sol.intToRoman(3) == "III" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 2 " << std::string(sol.intToRoman(4) == "IV" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 3 " << std::string(sol.intToRoman(9) == "IX" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 4 " << std::string(sol.intToRoman(58) == "LVIII" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 5 " << std::string(sol.intToRoman(1994) == "MCMXCIV" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 6 " << std::string(sol.intToRoman(3900) == "MMMCM" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 7 " << std::string(sol.intToRoman(800) == "DCCC" ? "passed" : "FAILED") << "\n";
	std::cout << "Test 8 " << std::string(sol.intToRoman(888) == "DCCCLXXXVIII" ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testIntToRoman();
	std::cout << "Hello World!\n";
}
