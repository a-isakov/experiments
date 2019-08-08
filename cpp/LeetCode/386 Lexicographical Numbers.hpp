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