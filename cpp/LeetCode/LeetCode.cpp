#include <iostream>
#include <vector>

#include "22 Generate Parentheses.hpp"

void testParentheses()
{
	Solution sol;
	vector<string> vec = { };
	std::cout << "Test 0 " << std::string(sol.generateParenthesis(0) == vec ? "passed" : "FAILED") << "\n";
	vec = { "()" };
	std::cout << "Test 1 " << std::string(sol.generateParenthesis(1) == vec ? "passed" : "FAILED") << "\n";
	vec = { "(())", "()()" };
	std::cout << "Test 2 " << std::string(sol.generateParenthesis(2) == vec ? "passed" : "FAILED") << "\n";
	vec = { "((()))", "(()())", "(())()", "()(())", "()()()" };
	std::cout << "Test 3 " << std::string(sol.generateParenthesis(3) == vec ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testParentheses();
	std::cout << "Hello World!\n";
}
