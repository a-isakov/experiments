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
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool isMatch(string s, string p) {
		if (p[0] == '*')
			return false;

		vector<Rule> rules;
		ParseRules(p, rules);
		if (rules.empty())
			return s.empty();

		buildPositions(s, rules);

		// Find last rule without repeat
		size_t lastRuleIndex = rules.size() - 1;
		while (lastRuleIndex >= 0 && rules[lastRuleIndex].positions.empty() && rules[lastRuleIndex].repeat)
		{
			lastRuleIndex--;
		}
		if (lastRuleIndex >= 0)
		{
			Rule& lastRule = rules[lastRuleIndex];
			for (unordered_map<int, bool>::iterator i = lastRule.positions.begin(); i != lastRule.positions.end(); i++)
			{
				// If reached out last char in the string then it matches
				if (i->first + 1 == s.length())
					return true;
			}
		}

		return false;
    }
protected:
	struct Rule {
		Rule(bool _repeat, char _c) {
			repeat = _repeat;
			c = _c;
		}
		bool repeat;
		char c;
		unordered_map<int, bool> positions;
	};
	
	// Transform rules into convenient format
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

	// Gather string position for each rule
	// 1st rule: find for characters in the string which may match to the 1st rule.
	// Nth rule: get string indexes from previous rule and compare next char against Nth rule. Build new map of positions
	void buildPositions(const string& s, vector<Rule>& rules) {
		for (size_t rIndex = 0; rIndex < rules.size(); rIndex++)
		{
			if (!rIndex)
			{
				size_t sIndex = 0;
				if (rules[rIndex].repeat)
				{
					rules[rIndex].positions[sIndex - 1] = true;
				}
				while (sIndex < s.length())
				{
					if (s[sIndex] == rules[rIndex].c || rules[rIndex].c == '.')
						rules[rIndex].positions[sIndex] = true;
					else if (rules[rIndex].repeat)
					{
						rules[rIndex].positions[sIndex - 1] = true;
						break;
					}
					
					if (!rules[rIndex].repeat)
						break;

					sIndex++;
				}
			}
			else
			{
				for(unordered_map<int, bool>::iterator i = rules[rIndex - 1].positions.begin(); i != rules[rIndex - 1].positions.end(); i++)
				{
					size_t sIndex = i->first + 1;
					if (rules[rIndex].repeat)
					{
						rules[rIndex].positions[sIndex - 1] = true;
					}
					while (sIndex < s.length())
					{
						if (s[sIndex] == rules[rIndex].c || rules[rIndex].c == '.')
							rules[rIndex].positions[sIndex] = true;
						else if (rules[rIndex].repeat)
						{
							rules[rIndex].positions[sIndex - 1];
							break;
						}

						if (!rules[rIndex].repeat)
							break;

						sIndex++;
					}
				}
			}
		}
	}

	// Works but slow
	//bool isMatch(const string& s, const vector<Rule>& rules, const size_t sIndex, const size_t rIndex) {
	//	if (rIndex == rules.size() && sIndex == s.length()) // Reached end at the same time
	//		return true;
	//	else if (rIndex == rules.size())
	//		return false;
	//	else if (sIndex == s.length())
	//	{
	//		if (!rules[rIndex].repeat)
	//			return false;
	//		else
	//			return isMatch(s, rules, sIndex, rIndex + 1);
	//	}

	//	bool result = false;
	//	if (s[sIndex] == rules[rIndex].c || rules[rIndex].c == '.')
	//	{
	//		result = isMatch(s, rules, sIndex + 1, rIndex + 1);
	//		if (!result && rules[rIndex].repeat)
	//		{
	//			result = isMatch(s, rules, sIndex + 1, rIndex);
	//			if (!result && rules[rIndex].repeat)
	//			{
	//				result = isMatch(s, rules, sIndex, rIndex + 1);
	//			}
	//		}
	//	}
	//	else if (rules[rIndex].repeat)
	//	{
	//		result = isMatch(s, rules, sIndex, rIndex + 1);
	//	}

	//	return result;
	//}

	// Does not work
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

void testRegExp()
{
	std::string resultString;
	Solution sol;
	resultString = sol.isMatch("aa", "a") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 1 " << resultString << "\n";

	resultString = sol.isMatch("aa", "a*") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 2 " << resultString << "\n";

	resultString = sol.isMatch("ab", ".*") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 3 " << resultString << "\n";

	resultString = sol.isMatch("aab", "c*a*b") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 4 " << resultString << "\n";

	resultString = sol.isMatch("mississippi", "mis*is*p*.") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 5 " << resultString << "\n";

	resultString = sol.isMatch("ab", ".*c") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 6 " << resultString << "\n";

	resultString = sol.isMatch("aaa", "a*a") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 7 " << resultString << "\n";

	resultString = sol.isMatch("aaa", "ab*a*c*a") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 8 " << resultString << "\n";

	resultString = sol.isMatch("aaa", "aaaa") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 9 " << resultString << "\n";

	resultString = sol.isMatch("a", "ab*") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 10 " << resultString << "\n";

	resultString = sol.isMatch("bbbba", ".*a*a") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 11 " << resultString << "\n";

	resultString = sol.isMatch("ab", ".*..") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 12 " << resultString << "\n";

	resultString = sol.isMatch("a", "") ? "FAILED" : "passed"; // Should be false
	std::cout << "Test 13 " << resultString << "\n";

	resultString = sol.isMatch("", "") ? "passed" : "FAILED"; // Should be true
	std::cout << "Test 14 " << resultString << "\n";
}
