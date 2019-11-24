/*
https://leetcode.com/problems/longest-common-prefix/
Write a function to find the longest common prefix string amongst an array of strings.
If there is no common prefix, return an empty string "".
Example 1:
Input: ["flower","flow","flight"]
Output: "fl"
Example 2:
Input: ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
Note:
All given inputs are in lowercase letters a-z.
*/

#include <string>
#include <vector>

using namespace std;

class Solution {
public:
	string longestCommonPrefix(vector<string>& strs) {
		if (!strs.size())
			return "";
		if (strs.size() == 1)
			return strs[0];
		for (size_t index = 0; index < strs[0].length(); index++)
		{
			for (size_t i = 1; i < strs.size(); i++)
			{
				if (strs[i].length() == index)
					return strs[i];
				if (strs[i].at(index) != strs[i - 1].at(index))
				{
					strs[0].resize(index);
					return strs[0];
				}
			}
		}
		return strs[0];
	}
};