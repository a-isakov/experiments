/*
Determine whether an integer is a palindrome. An integer is a palindrome when it reads the same backward as forward.

Example 1:

Input: 121
Output: true
Example 2:

Input: -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.
Example 3:

Input: 10
Output: false
Explanation: Reads 01 from right to left. Therefore it is not a palindrome.
*/
class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0)
            return false;
        else if (x < 10)
            return true;
        else
            return x == reverse(x);
    }
protected:
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
