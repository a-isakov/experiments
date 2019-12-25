#include <iostream>
#include <vector>

#include "22 Generate Parentheses.hpp"

void testParentheses()
{
	Solution sol;
	vector<string> vec = { "((()))", "(()())", "(())()", "()(())", "()()()" };
	std::cout << "Test 1 " << std::string(sol.generateParenthesis(3) == vec ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testParentheses();
	std::cout << "Hello World!\n";
}
