/*
https://leetcode.com/problems/divide-two-integers/
Given two integers dividend and divisor, divide two integers without using multiplication, division and mod operator.
Return the quotient after dividing dividend by divisor.
The integer division should truncate toward zero.
Example 1:
Input: dividend = 10, divisor = 3
Output: 3
Example 2:
Input: dividend = 7, divisor = -3
Output: -2
*/

#include <iostream>
#include <string>

class Solution {
public:
    int divide(int dividend, int divisor) {
        if (divisor == 1)
            return dividend;
        if (divisor == -1)
        {
            if (dividend == -2147483648)
                return 2147483647;
            else
                return -dividend;
        }
        bool positive = (dividend >= 0 && divisor >= 0) || (dividend < 0 && divisor < 0);
        if (dividend > 0)
            dividend = -dividend;
        if (divisor > 0)
            divisor = -divisor;
        if (dividend == divisor)
            return positive ? 1 : -1;
        int result = 0;
        if (dividend < divisor)
        {
            result = 1;
            while (!(dividend & 1) && !(divisor & 1))
            {
                dividend = dividend >> 1;
                divisor = divisor >> 1;
            }
            if (divisor == -1)
                return positive ? -dividend : dividend;
            int multiplier = divisor;
            while (dividend <= multiplier && multiplier > (int)0xc0000000)
            {
                multiplier = (multiplier & 0xffffffff) << 1;
                if (multiplier > dividend)
                    result = result << 1;
            }
            if (multiplier > (int)0xc0000000 || multiplier <= dividend)
                multiplier = multiplier >> 1;
            dividend -= multiplier;
            while (dividend <= divisor)
            {
                dividend -= divisor;
                result++;
            }
        }
        return positive ? result : -result;
    }

    void test()
    {
        std::cout << "Test 0 " << std::string(divide(214, 3) == 71 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 1 " << std::string(divide(1, 4) == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 2 " << std::string(divide(10, 3) == 3 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 3 " << std::string(divide(7, -3) == -2 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 4 " << std::string(divide(-7, 3) == -2 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 5 " << std::string(divide(1, 1) == 1 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 6 " << std::string(divide(-40, -2) == 20 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 7 " << std::string(divide(-2147483648, -1) == 2147483647 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 8 " << std::string(divide(-1010369383, -2147483648) == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 9 " << std::string(divide(-2147483648, 2) == -1073741824 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 10 " << std::string(divide(2147483647, 3) == 715827882 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 11 " << std::string(divide(-1021989372, -82778243) == 12 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 12 " << std::string(divide(1026117192, -874002063) == -1 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 13 " << std::string(divide(-1046638222, 564425312) == -1 ? "passed" : "FAILED") << "\n";
        std::cout << "Completed\n";
    }
};