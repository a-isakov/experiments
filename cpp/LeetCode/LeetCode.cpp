#include <iostream>
#include <vector>

#include "14 Longest Common Prefix.hpp"

void testLongestCommonPrefix()
{
	Solution sol;
	vector<string> strs = { "flower","flow","flight" };
	std::cout << "Test 1 " << std::string(sol.longestCommonPrefix(strs) == "fl" ? "passed" : "FAILED") << "\n";
	strs = { "dog","racecar","car" };
	std::cout << "Test 2 " << std::string(sol.longestCommonPrefix(strs) == "" ? "passed" : "FAILED") << "\n";
	strs = { "" };
	std::cout << "Test 3 " << std::string(sol.longestCommonPrefix(strs) == "" ? "passed" : "FAILED") << "\n";
	strs = { "b", "cb", "cab" };
	std::cout << "Test 4 " << std::string(sol.longestCommonPrefix(strs) == "" ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testLongestCommonPrefix();
	std::cout << "Hello World!\n";
}
