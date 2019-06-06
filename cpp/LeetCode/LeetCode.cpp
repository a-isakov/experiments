// LeetCode.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include "Regular Expression Matching.hpp"

int main()
{
	std::string resultString;
	Solution sol;
	resultString = sol.isMatch("aa", "a") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 1 " << resultString << "\n";

	resultString = sol.isMatch("aa", "a*") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 2 " << resultString << "\n";

	resultString = sol.isMatch("ab", ".*") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 3 " << resultString << "\n";

	resultString = sol.isMatch("aab", "c*a*b") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 4 " << resultString << "\n";

	resultString = sol.isMatch("mississippi", "mis*is*p*.") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 5 " << resultString << "\n";

	resultString = sol.isMatch("ab", ".*c") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 6 " << resultString << "\n";

	resultString = sol.isMatch("aaa", "a*a") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 6 " << resultString << "\n";

	std::cout << "Hello World!\n";
}
