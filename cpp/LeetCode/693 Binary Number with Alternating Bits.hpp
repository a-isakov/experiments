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
		int n1 = n;
		unsigned int mask = 0;
		while (n1)
		{
			n1 >>= 1;
			mask <<= 1;
			mask |= 1;
		}

		BIG_INT_0 &= mask;
		BIG_INT_1 &= mask;
		if (n & 1)
		{
			if ((BIG_INT_0 | n) == mask && (BIG_INT_1 & n) == n)
				return true;
		}
		else
		{
			if ((BIG_INT_1 | n) == mask && (BIG_INT_0 & n) == n)
				return true;
		}
		return false;
	}
protected:
	int BIG_INT_1 = 0b1010101010101010101010101010101;
	int BIG_INT_0 = 0b0101010101010101010101010101010;
};

void testBits()
{
	Solution sol;
	std::cout << "Test 1 " << std::string(sol.hasAlternatingBits(5) ? "passed" : "FAILED") << "\n";
	std::cout << "Test 2 " << std::string(!sol.hasAlternatingBits(7) ? "passed" : "FAILED") << "\n";
	std::cout << "Test 3 " << std::string(!sol.hasAlternatingBits(11) ? "passed" : "FAILED") << "\n";
	std::cout << "Test 4 " << std::string(sol.hasAlternatingBits(10) ? "passed" : "FAILED") << "\n";
	std::cout << "Test 5 " << std::string(!sol.hasAlternatingBits(4) ? "passed" : "FAILED") << "\n";
	std::cout << "Test 6 " << std::string(!sol.hasAlternatingBits(8) ? "passed" : "FAILED") << "\n";
}