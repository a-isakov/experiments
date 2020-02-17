/*
https://leetcode.com/problems/implement-strstr/
Implement strStr().
Return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.
Example 1:
Input: haystack = "hello", needle = "ll"
Output: 2
Example 2:
Input: haystack = "aaaaa", needle = "bba"
Output: -1
*/

#include <iostream>
#include <string>

using namespace std;

class Solution {
public:
    int strStr(string haystack, string needle) {
        if (needle.empty())
            return 0;
        const int bound = (int)haystack.length() - (int)needle.length();
        for (int i = 0; i <= bound; i++)
        {
            if (!memcmp(&haystack[i], &needle[0], needle.length()))
                return (int)i;
        }
        return -1;
    }

    void test()
    {
        std::cout << "Test 1 " << std::string(strStr("hello", "ll") == 2 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 2 " << std::string(strStr("aaaaa", "bba") == -1 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 3 " << std::string(strStr("hello", "") == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 4 " << std::string(strStr("", "") == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 5 " << std::string(strStr("", "ll") == -1 ? "passed" : "FAILED") << "\n";
        std::cout << "Completed\n";
    }
};