/*
https://leetcode.com/problems/count-and-say/
The count-and-say sequence is the sequence of integers with the first five terms as following:
1.     1
2.     11
3.     21
4.     1211
5.     111221
1 is read off as "one 1" or 11.
11 is read off as "two 1s" or 21.
21 is read off as "one 2, then one 1" or 1211.
Given an integer n where 1 <= n <= 30, generate the nth term of the count-and-say sequence. You can do so recursively, in other words from the previous member read off the digits, counting the number of digits in groups of the same digit.
Note: Each term of the sequence of integers will be represented as a string.
Example 1:
Input: 1
Output: "1"
Explanation: This is the base case.
Example 2:
Input: 4
Output: "1211"
Explanation: For n = 3 the term was "21" in which we have two groups "2" and "1", "2" can be read as "12" which means frequency = 1 and value = 2, the same way "1" is read as "11", so the answer is the concatenation of "12" and "11" which is "1211".
*/
#include <iostream>
#include <string>

using namespace std;

class Solution {
public:
    string countAndSay(int n) {
        if (n < 1 || n > 30)
            return "";
        char buffer1[5 * 1024] = "1";
        char buffer2[5 * 1024];
        if (n == 1)
            return buffer1;
        char* bufferRead = buffer1;
        char* bufferWrite = buffer2;
        for (int i = 1; i < n; i++)
        {
            char* reader = bufferRead;
            char* writer = bufferWrite;
            char counter = 1;
            char memorizer = *reader;
            do
            {
                reader++;
                if (memorizer == *reader)
                    counter++;
                else
                {
                    *writer++ = counter + 48;
                    *writer++ = memorizer;
                    memorizer = *reader;
                    counter = 1;
                }
            } while (*reader);
            // Append line end
            *writer = 0;
            // Switch buffers
            char* tmp = bufferRead;
            bufferRead = bufferWrite;
            bufferWrite = tmp;
        }
        return bufferRead;
    }

    void test()
    {
        std::cout << "Test 1 " << std::string(countAndSay(1) == "1" ? "passed" : "FAILED") << "\n";
        std::cout << "Test 2 " << std::string(countAndSay(2) == "11" ? "passed" : "FAILED") << "\n";
        std::cout << "Test 3 " << std::string(countAndSay(3) == "21" ? "passed" : "FAILED") << "\n";
        std::cout << "Test 4 " << std::string(countAndSay(4) == "1211" ? "passed" : "FAILED") << "\n";
        std::cout << "Test 5 " << std::string(countAndSay(5) == "111221" ? "passed" : "FAILED") << "\n";
        std::cout << "Test 6 " << std::string(countAndSay(6) == "312211" ? "passed" : "FAILED") << "\n";
        std::cout << "Test 7 " << std::string(countAndSay(7) == "13112221" ? "passed" : "FAILED") << "\n";
    }
};
