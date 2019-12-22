#include <iostream>
#include <vector>

#include "20 Valid Parentheses.hpp"

void testRemoveNth()
{
	Solution sol;
	std::cout << "Test 1 " << std::string(sol.isValid("()") ? "passed" : "FAILED") << "\n";
	std::cout << "Test 2 " << std::string(sol.isValid("()[]{}") ? "passed" : "FAILED") << "\n";
	std::cout << "Test 3 " << std::string(!sol.isValid("(]") ? "passed" : "FAILED") << "\n";
	std::cout << "Test 4 " << std::string(!sol.isValid("([)]") ? "passed" : "FAILED") << "\n";
	std::cout << "Test 5 " << std::string(sol.isValid("{[]}") ? "passed" : "FAILED") << "\n";
	std::cout << "Test 6 " << std::string(!sol.isValid("[") ? "passed" : "FAILED") << "\n";
	std::cout << "Test 7 " << std::string(!sol.isValid("]") ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testRemoveNth();
	std::cout << "Hello World!\n";
}
