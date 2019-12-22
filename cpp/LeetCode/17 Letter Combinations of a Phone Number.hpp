/*
https://leetcode.com/problems/letter-combinations-of-a-phone-number/
Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.
A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.
[1     ] [2 abc] [3 def ]
[4 ghi ] [5 jkl] [6 mno ]
[7 pqrs] [8 tuv] [9 wxyz]
Example:
Input: "23"
Output: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"].
Note:
Although the above answer is in lexicographical order, your answer could be in any order you want.
*/

#include <vector>
#include <string>

using namespace std;

class Solution {
public:
	vector<string> letterCombinations(string digits) {
		vector<string> result;
		if (!digits.empty())
		{
			char* source = &digits[0];
			char* res = new char[digits.length() + 1];
			res[digits.length()] = 0;
			composeString(0, source, res, result);
			delete[] res;
		}
		return result;
	}
private:
	void composeString(const size_t pos, const char* source, char* res, vector<string> &result)
	{
		if (source[pos] == 0)
		{
			result.push_back(res);
			return;
		}
		char c = source[pos] - 48 - 1;
		for (size_t i = 0; i < mapping[c].size(); i++)
		{
			res[pos] = mapping[c][i];
			composeString(pos + 1, source, res, result);
		}
	}

	vector<vector<char>> mapping =
	{
		{},
		{'a', 'b', 'c'},
		{'d', 'e', 'f'},
		{'g', 'h', 'i'},
		{'j', 'k', 'l'},
		{'m', 'n', 'o'},
		{'p', 'q', 'r', 's'},
		{'t', 'u', 'v'},
		{'w', 'x', 'y', 'z'}
	};
};