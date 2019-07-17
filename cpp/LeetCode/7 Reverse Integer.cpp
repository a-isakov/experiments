/*
Given a 32-bit signed integer, reverse digits of an integer.

Example 1:

Input: 123
Output: 321
Example 2:

Input: -123
Output: -321
Example 3:

Input: 120
Output: 21
Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [2^31,  2^31 - 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.
*/
class Solution {
public:
    int reverse(int x) {
        int ret = 0;
        while (x)
        {
            int d = x%10;
            x /= 10;
            if (ret > INT_MAX/10 || ret < INT_MIN/10)
                return 0;
            ret *= 10;
            ret += d;
        }
        return ret;
    }
};
