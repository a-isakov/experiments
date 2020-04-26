/*
https://leetcode.com/problems/sqrtx/
Implement int sqrt(int x).
Compute and return the square root of x, where x is guaranteed to be a non-negative integer.
Since the return type is an integer, the decimal digits are truncated and only the integer part of the result is returned.
Example 1:
Input: 4
Output: 2
Example 2:
Input: 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since
             the decimal part is truncated, 2 is returned.
*/

#include <iostream>
#include <string>
#include <time.h>

using namespace std;

class Solution {
public:
    int mySqrt(int x) {
        if (x <= 1)
            return x;
        result = 0;
        target = x;
        while (x > 46340*2)
            x >>= 1;
        move(true, 0, x);
        return result;
    }

    void move(const bool decrease, const unsigned int left, const unsigned int right)
    {
        if (decrease)
        {
            unsigned int rightNew = right - ((right - left) >> 1);
            if (rightNew == right)
                result = left;
            else
            {
                unsigned int s = rightNew * rightNew;
                if (s == target)
                    result = (int)rightNew;
                else if (s > target)
                    move(true, left, rightNew);
                else
                    move(false, rightNew, right);
            }
        }
        else
        {
            unsigned int leftNew = left + ((right - left) >> 1);
            if (leftNew == left)
                result = left;
            else
            {
                unsigned int s = leftNew * leftNew;
                if (s == target)
                    result = (int)leftNew;
                else if (s > target)
                    move(true, left, leftNew);
                else
                    move(false, leftNew, right);
            }
        }
    }

    int result;
    unsigned int target;

    void test()
    {
        std::cout << "Test 1 " << std::string(mySqrt(4) == 2 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 2 " << std::string(mySqrt(8) == 2 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 3 " << std::string(mySqrt(2147395599) == 46339 ? "passed" : "FAILED") << "\n";
        srand((unsigned)time(NULL));
        for (int i = 0; i < 100; i++)
        {
            int x = abs(rand() * rand());
            int my = mySqrt(x);
            int stable = (int)sqrt(x);
            if (my != stable)
                std::cout << "Random test FAILED for x = " << x << ". My = " << my << " vs " << stable << "\n";
        }
    }
};