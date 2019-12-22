#include <iostream>
#include <vector>

#include "17 Letter Combinations of a Phone Number.hpp"

void testLettersPhone()
{
	Solution sol;
	vector<string> vec = { "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf" };
	std::cout << "Test 1 " << std::string(sol.letterCombinations("23") == vec ? "passed" : "FAILED") << "\n";
	vec = { };
	std::cout << "Test 2 " << std::string(sol.letterCombinations("") == vec ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testLettersPhone();
	std::cout << "Hello World!\n";
}
