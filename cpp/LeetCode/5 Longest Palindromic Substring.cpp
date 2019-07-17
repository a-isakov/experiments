/*
Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example 1:

Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.
Example 2:

Input: "cbbd"
Output: "bb"
*/
// "mwwfjysbkebpdjyabcfkgprtxpwvhglddhmvaprcvrnuxifcrjpdgnktvmggmguiiquibmtviwjsqwtchkqgxqwljouunurcdtoeygdqmijdympcamawnlzsxucbpqtuwkjfqnzvvvigifyvymfhtppqamlgjozvebygkxawcbwtouaankxsjrteeijpuzbsfsjwxejtfrancoekxgfyangvzjkdskhssdjvkvdskjtiybqgsmpxmghvvicmjxqtxdowkjhmlnfcpbtwvtmjhnzntxyfxyinmqzivxkwigkondghzmbioelmepgfttczskvqfejfiibxjcuyevvpawybcvvxtxycrfbcnpvkzryrqujqaqhoagdmofgdcbhvlwgwmsmhomknbanvntspvvhvccedzzngdywuccxrnzbtchisdwsrfdqpcwknwqvalczznilujdrlevncdsyuhnpmheukottewtkuzhookcsvctsqwwdvfjxifpfsqxpmpwospndozcdbfhselfdltmpujlnhfzjcgnbgprvopxklmlgrlbldzpnkhvhkybpgtzipzotrgzkdrqntnuaqyaplcybqyvidwcfcuxinchretgvfaepmgilbrtxgqoddzyjmmupkjqcypdpfhpkhitfegickfszermqhkwmffdizeoprmnlzbjcwfnqyvmhtdekmfhqwaftlyydirjnojbrieutjhymfpflsfemkqsoewbojwluqdckmzixwxufrdpqnwvwpbavosnvjqxqbosctttxvsbmqpnolfmapywtpfaotzmyjwnd"

#include <string>
#include <vector>
#include <stack>

using namespace std;

class Solution {
public:
	string longestPalindrome(string s) {
		if (!s.length())
			return "";
		int longestSize = 0;
		int longestIndex = 0;
		stack<int> oddIndexes;
		stack<int> evenIndexes;
		for (int i = 0; i < s.length() - 1; i++)
		{
			if (i > 0 && s[i - 1] == s[i + 1])
				oddIndexes.push(i);
			if (s[i] == s[i + 1])
				evenIndexes.push(i);
		}

		if (oddIndexes.empty() && evenIndexes.empty() && s.length())
			return s.substr(0, 1);

		while (!oddIndexes.empty())
		{
			int pos = oddIndexes.top();
			oddIndexes.pop();
			int i = 2;
			while (pos - i >= 0 && pos + i <= s.length() && s[pos - i] == s[pos + i])
			{
				i++;
			}
			i--;
			int size = i * 2 + 1;
			if (size > longestSize)
			{
				longestSize = size;
				longestIndex = pos - i;
			}
		}
		while (!evenIndexes.empty())
		{
			int pos = evenIndexes.top();
			evenIndexes.pop();
			int i = 1;
			while (pos - i >= 0 && pos + i + 1 <= s.length() && s[pos - i] == s[pos + i + 1])
			{
				i++;
			}
			i--;
			int size = i * 2 + 2;
			if (size > longestSize)
			{
				longestSize = size;
				longestIndex = pos - i;
			}
		}
		if (longestSize)
			return s.substr(longestIndex, longestSize);

		return "";
	}
};
