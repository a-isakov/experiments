/*
Given a positive integer, check whether it has alternating bits: namely, if two adjacent bits will always have different values.

Example 1:
Input: 5
Output: True
Explanation:
The binary representation of 5 is: 101
Example 2:
Input: 7
Output: False
Explanation:
The binary representation of 7 is: 111.
Example 3:
Input: 11
Output: False
Explanation:
The binary representation of 11 is: 1011.
Example 4:
Input: 10
Output: True
Explanation:
The binary representation of 10 is: 1010.
*/

using namespace std;

class Solution {
public:
	bool hasAlternatingBits(int n) {
		int BIG_INT_1 = 0b1010101010101010101010101010101;
		int BIG_INT_0 = 0b0101010101010101010101010101010;

		int n1 = n;
		unsigned int mask = 0;
		while (n1)
		{
			n1 >>= 1;
			mask <<= 1;
			mask |= 1;
		}

		if (n & 1)
		{
			BIG_INT_1 &= mask;
			if ((BIG_INT_1 & n) == BIG_INT_1 && !(n & BIG_INT_0))
				return true;
		}
		else
		{
			BIG_INT_0 &= mask;
			if ((BIG_INT_0 & n) == BIG_INT_0 && !(n && BIG_INT_1))
				return true;
		}
		return false;
	}
};
