/*
https://leetcode.com/problems/search-insert-position/
Given a sorted array and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.
You may assume no duplicates in the array.
Example 1:
Input: [1,3,5,6], 5
Output: 2
Example 2:
Input: [1,3,5,6], 2
Output: 1
Example 3:
Input: [1,3,5,6], 7
Output: 4
Example 4:
Input: [1,3,5,6], 0
Output: 0
*/

#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++)
        {
            if (nums[i] >= target)
                return i;
        }
        return (int)nums.size();
    }

    void test()
    {
        vector<int> vec = { 1, 3, 5, 6 };
        std::cout << "Test 1 " << std::string(searchInsert(vec, 1) == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 2 " << std::string(searchInsert(vec, 5) == 2 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 3 " << std::string(searchInsert(vec, 2) == 1 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 4 " << std::string(searchInsert(vec, 7) == 4 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 5 " << std::string(searchInsert(vec, 0) == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Test 6 " << std::string(searchInsert(vec, 6) == 3 ? "passed" : "FAILED") << "\n";
        vec = { };
        std::cout << "Test 7 " << std::string(searchInsert(vec, 1) == 0 ? "passed" : "FAILED") << "\n";
        std::cout << "Completed\n";
    }
};