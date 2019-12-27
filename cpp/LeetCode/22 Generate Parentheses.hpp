/*
https://leetcode.com/problems/generate-parentheses/
Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.
For example, given n = 3, a solution set is:
[
  "((()))",
  "(()())",
  "(())()",
  "()(())",
  "()()()"
]
*/

#include <vector>
#include <string>

using namespace std;

class Solution {
public:
	vector<string> generateParenthesis(int n) {
		vector<string> result;
		if (!n)
			return result;
		int max = n << 1;
		char* res = new char[max + 1];
		res[max] = 0;
		res[0] = '(';
		addRest(n - 1, n, res, 1, result);
		delete[] res;
		return result;
	}
private:
	inline void addRest(int l, int r, char* res, int index, vector<string> &result)
	{
		if (!l && !r)
			result.push_back(res);
		else if (l <= r)
		{
			if (l)
			{
				res[index] = '(';
				addRest(l - 1, r, res, index + 1, result);
			}
			if (r && r > l)
			{
				res[index] = ')';
				addRest(l, r - 1, res, index + 1, result);
			}
		}
	}
};