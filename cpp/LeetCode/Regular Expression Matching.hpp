/*
Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.

'.' Matches any single character.
'*' Matches zero or more of the preceding element.
The matching should cover the entire input string (not partial).

Note:

s could be empty and contains only lowercase letters a-z.
p could be empty and contains only lowercase letters a-z, and characters like . or *.
Example 1:

Input:
s = "aa"
p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".
Example 2:

Input:
s = "aa"
p = "a*"
Output: true
Explanation: '*' means zero or more of the precedeng element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".
Example 3:

Input:
s = "ab"
p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".
Example 4:

Input:
s = "aab"
p = "c*a*b"
Output: true
Explanation: c can be repeated 0 times, a can be repeated 1 time. Therefore it matches "aab".
Example 5:

Input:
s = "mississippi"
p = "mis*is*p*."
Output: false
*/
#include <string>
#include <vector>

using namespace std;

class Solution {
public:
    bool isMatch(string s, string p) {
		if (p[0] == '*')
			return false;

		vector<Rule> rules;
		ParseRules(p, rules);

		bool result = isMatch(s, rules, 0, 0);

		return result;
    }
protected:
	struct Rule {
		Rule(bool _repeat, char _c) {
			repeat = _repeat;
			c = _c;
		}
		bool repeat;
		char c;
	};

	bool isMatch(const string& s, const vector<Rule>& rules, const size_t sIndex, const size_t rIndex) {
		if (rIndex == rules.size() && sIndex == s.length()) // Reached end at the same time
			return true;
		else if (rIndex == rules.size())
			return false;
		else if (sIndex == s.length())
		{
			if (!rules[rIndex].repeat)
				return false;
			else
				return isMatch(s, rules, sIndex, rIndex + 1);
		}

		bool result = false;
		if (s[sIndex] == rules[rIndex].c || rules[rIndex].c == '.')
		{
			result = isMatch(s, rules, sIndex + 1, rIndex + 1);
			if (!result && rules[rIndex].repeat)
			{
				result = isMatch(s, rules, sIndex + 1, rIndex);
			}
		}
		else if (rules[rIndex].repeat)
		{
			result = isMatch(s, rules, sIndex, rIndex + 1);
		}

		return result;
	}

	void ParseRules(string& p, vector<Rule>& rules) {
		size_t rIndex = 0;
		for (size_t i = 0; i < p.length(); i++)
		{
			switch (p[i])
			{
			case '*':
				if (rIndex > 1 && rules[rIndex - 2].c == '.' && rules[rIndex - 2].repeat)
				{
					rules.pop_back();
					rIndex--;
				}
				else
					rules[rIndex - 1].repeat = true;
				break;
			default:
				rules.push_back(Rule(false, p[i]));
				rIndex++;
			}
		}
	}

	//bool isMatch(string& s, string& p, size_t sIndex, size_t pIndex) {
	//	if (pIndex == p.length() && sIndex == s.length())
	//		return true;
	//	else if (pIndex == p.length())
	//		return false;
	//	else if (sIndex == s.length())
	//	{
	//		if (p[pIndex] == '*' && pIndex == p.length() - 1) // This is the last rule
	//			return true;
	//		else
	//			return false;
	//	}

	//	switch (p[pIndex])
	//	{
	//	case '.':
	//		return isMatch(s, p, sIndex + 1, pIndex + 1);
	//	case '*':
	//	{
	//		bool res = false;
	//		if (s[sIndex] == p[pIndex - 1] || p[pIndex - 1] == '.')
	//		{
	//			res = isMatch(s, p, sIndex + 1, pIndex);
	//			if (!res)
	//				res = isMatch(s, p, sIndex + 1, pIndex + 1);
	//		}
	//		else
	//			res = isMatch(s, p, sIndex, pIndex + 1);
	//		return res;
	//	}
	//	default:
	//		if (s[sIndex] == p[pIndex]) // Characters are matching
	//		{
	//			bool res = isMatch(s, p, sIndex + 1, pIndex + 1);
	//			if (!res && pIndex < p.length() - 1 && p[pIndex + 1] == '*')
	//				res = isMatch(s, p, sIndex, pIndex + 1);
	//			return res;
	//		}
	//		else if (pIndex == p.length() - 1) // Last in the rule
	//			return false;
	//		else if (p[pIndex + 1] != '*') // Next one is not *
	//			return false;
	//		else // Next one is *
	//			return isMatch(s, p, sIndex, pIndex + 1);
	//	}

	//	return false;
	//}
};
