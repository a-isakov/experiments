/*
https://leetcode.com/problems/integer-to-roman/
Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
For example, two is written as II in Roman numeral, just two one's added together. Twelve is written as, XII, which is simply X + II. The number twenty seven is written as XXVII, which is XX + V + II.
Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:
I can be placed before V (5) and X (10) to make 4 and 9.
X can be placed before L (50) and C (100) to make 40 and 90.
C can be placed before D (500) and M (1000) to make 400 and 900.
Given an integer, convert it to a roman numeral. Input is guaranteed to be within the range from 1 to 3999.
Example 1:
Input: 3
Output: "III"
Example 2:
Input: 4
Output: "IV"
Example 3:
Input: 9
Output: "IX"
Example 4:
Input: 58
Output: "LVIII"
Explanation: L = 50, V = 5, III = 3.
Example 5:
Input: 1994
Output: "MCMXCIV"
Explanation: M = 1000, CM = 900, XC = 90 and IV = 4.
*/

#include <string>
#include <vector>

using namespace std;

class Solution {
private:
	vector<vector<string>> converter = { { "", "", "", "" }, // 0
										{ "I", "X", "C", "M" }, // 1
										{ "II", "XX", "CC", "MM" }, // 2
										{ "III", "XXX", "CCC", "MMM" }, // 3
										{ "IV", "XL", "CD", "" }, // 4
										{ "V", "L", "D", "" }, // 5
										{ "VI", "LX", "DC", "" }, // 6
										{ "VII", "LXX", "DCC", "" }, // 7
										{ "VIII", "LXXX", "DCCC", "" }, // 8
										{ "IX", "XC", "CM", "" } // 9
	};
	char rDigits[7] = {'I', 'V', 'X', 'L', 'C', 'D', 'M'};
	int levels[4] = {1, 10, 100, 1000};
	char roman[15];

public:
	string intToRoman(int num) {
		size_t index = 0;
		size_t digitIndex = 6;
		for (int level = 3; level >= 0; level--)
		{
			int right = num % levels[level];
			int n = (num - right) / levels[level];
			num = right;
			switch (n)
			{
			case 1:
			case 2:
			case 3:
				for (int i = 0; i < n; i++)
					roman[index++] = rDigits[digitIndex];
				break;
			case 4:
				roman[index++] = rDigits[digitIndex];
			case 5:
				roman[index++] = rDigits[digitIndex + 1];
				break;
			case 6:
			case 7:
			case 8:
				roman[index++] = rDigits[digitIndex + 1];
				for (int i = 0; i < n - 5; i++)
					roman[index++] = rDigits[digitIndex];
				break;
			case 9:
				roman[index++] = rDigits[digitIndex];
				roman[index++] = rDigits[digitIndex + 2];
			}
			digitIndex -= 2;
		}
		roman[index] = 0;
		return roman;
	}

	string intToRomanSlow2(int num) {
		size_t index = 0;
		roman[0] = 0;
		for (int level = 3; level >= 0; level--)
		{
			int right = num % levels[level];
			int n = (num - right) / levels[level];
			num = right;
			if (n)
			{
				size_t length = converter[n][level].length();
				::memcpy(&roman[index], converter[n][level].c_str(), length);
				index += length;
			}
		}
		roman[index] = 0;
		return roman;
	}

	string intToRomanSlow(int num) {
		int level = 0;
		string result;
		while (num)
		{
			int n = num % 10;
			if (n)
				result.insert(0, converter[n][level]);

			level++;
			num /= 10;
		}
		return result;
	}
};