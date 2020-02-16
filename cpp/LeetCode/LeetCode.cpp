#include <iostream>
#include <vector>

#include "26 Remove Duplicates from Sorted Array.hpp"

void runTests()
{
	Solution sol;
	vector<int> vec = { 1,1,2 };
	vec.resize(sol.removeDuplicates(vec));
	std::cout << "Test 1 " << std::string(vec.size() == 2 && vec == vector<int>{ 1, 2 } ? "passed" : "FAILED") << "\n";

	vec = { 0,0,1,1,1,2,2,3,3,4 };
	vec.resize(sol.removeDuplicates(vec));
	std::cout << "Test 2 " << std::string(vec.size() == 5 && vec == vector<int>{ 0, 1, 2, 3, 4 } ? "passed" : "FAILED") << "\n";

	vec = { };
	vec.resize(sol.removeDuplicates(vec));
	std::cout << "Test 3 " << std::string(vec.size() == 0 ? "passed" : "FAILED") << "\n";

	vec = { 0 };
	vec.resize(sol.removeDuplicates(vec));
	std::cout << "Test 4 " << std::string(vec.size() == 1 ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	runTests();
	std::cout << "Completed\n";
}
