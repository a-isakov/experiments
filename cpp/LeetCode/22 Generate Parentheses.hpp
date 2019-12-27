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
		char* res = new char[n * 2 + 1];
		res[n * 2] = 0;
		//for (int l = 0; l < n; l++)
		//{ }
		res[0] = '(';
		addRest(n - 1, n, res, 1, result);
		delete[] res;
		return result;
	}
private:
	void addRest(int l, int r, char* res, int index, vector<string> &result)
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
			if (r)
			{
				res[index] = ')';
				addRest(l, r - 1, res, index + 1, result);
			}
		}
	}
};