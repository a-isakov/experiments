/*
https://leetcode.com/problems/lexicographical-numbers/
Given an integer n, return 1 - n in lexicographical order.
For example, given 13, return: [1,10,11,12,13,2,3,4,5,6,7,8,9].
Please optimize your algorithm to use less time and space. The input size may be as large as 5,000,000.
*/

#include <vector>

using namespace std;

class Solution {
private:
	void pushMultipliers(vector<int>& v, const int value, const int multiplier, const int n)
	{
		const int nextMultiplier = multiplier * 10;
		for (int i = value * 10; i < (value + 1) * 10 && i <= n; i++)
		{
			v.push_back(i);
			if (nextMultiplier <= n)
				pushMultipliers(v, i, nextMultiplier, n);
		}
	}
public:
	vector<int> lexicalOrder(int n) {
		vector<int> v;
		v.reserve(n);
		if (n < 10)
		{
			for (int i = 0; i < n; i++)
				v.push_back(i + 1);
		}
		else
		{
			for (int i = 1; i < 10; i++)
			{
				v.push_back(i);
				pushMultipliers(v, i, 10, n);
			}
		}

		return v;
	}
};

void testLexicographicalNumbers()
{
	Solution sol;
	std::string resultString;
	std::vector<int> v = { 1,10,11,12,13,2,3,4,5,6,7,8,9 };
	std::cout << "Test 1 " << std::string(sol.lexicalOrder(13) == v ? "passed" : "FAILED") << "\n";

	v = { 1,10,11,12,13,14,15,16,17,18,19,2,20,21,22,23,24,25,26,27,28,29,3,30,31,32,33,34,4,5,6,7,8,9 };
	std::cout << "Test 2 " << std::string(sol.lexicalOrder(34) == v ? "passed" : "FAILED") << "\n";

	v = { 1,10,100,11,12,13,14,15,16,17,18,19,2,20,21,22,23,24,25,26,27,28,29,3,30,31,32,33,34,35,36,37,38,39,4,40,41,42,43,44,45,46,47,48,49,5,50,51,52,53,54,55,56,57,58,59,6,60,61,62,63,64,65,66,67,68,69,7,70,71,72,73,74,75,76,77,78,79,8,80,81,82,83,84,85,86,87,88,89,9,90,91,92,93,94,95,96,97,98,99 };
	std::cout << "Test 3 " << std::string(sol.lexicalOrder(100) == v ? "passed" : "FAILED") << "\n";
}