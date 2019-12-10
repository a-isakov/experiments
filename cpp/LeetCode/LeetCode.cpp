#include <iostream>
#include <vector>

#include "15 3Sum.hpp"

void test3Sum()
{
	Solution sol;
	vector<int> vec = { -1, 0, 1, 2, -1, -4 };
	vector<vector<int>> vec2 = { {-1, -1, 2}, {-1, 0, 1} };
	std::cout << "Test 1 " << std::string(sol.threeSum(vec) == vec2 ? "passed" : "FAILED") << "\n";
	vec = { -1, 0 };
	vec2 = {  };
	std::cout << "Test 2 " << std::string(sol.threeSum(vec) == vec2 ? "passed" : "FAILED") << "\n";
	vec = { -1, 0, 1 };
	vec2 = { {-1, 0, 1} };
	std::cout << "Test 3 " << std::string(sol.threeSum(vec) == vec2 ? "passed" : "FAILED") << "\n";
	vec = { -2, 0, 1, 1, 2 };
	vec2 = { {-2, 0, 2}, {-2, 1, 1} };
	std::cout << "Test 4 " << std::string(sol.threeSum(vec) == vec2 ? "passed" : "FAILED") << "\n";
	vec = { 0, 0, 0 };
	vec2 = { {0, 0, 0} };
	std::cout << "Test 5 " << std::string(sol.threeSum(vec) == vec2 ? "passed" : "FAILED") << "\n";
	vec = { -4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6 };
	vec2 = { {-4, -2, 6}, {-4, 0, 4}, {-4, 1, 3}, {-4, 2, 2}, {-2, -2, 4}, {-2, 0, 2} };
	std::cout << "Test 6 " << std::string(sol.threeSum(vec) == vec2 ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	test3Sum();
	std::cout << "Hello World!\n";
}
