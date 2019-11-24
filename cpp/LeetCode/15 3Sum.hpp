/*
https://leetcode.com/problems/3sum/
Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.
Note:
The solution set must not contain duplicate triplets.
Example:
Given array nums = [-1, 0, 1, 2, -1, -4],
A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
*/

#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
	vector<vector<int>> threeSum(vector<int>& nums) {
		vector<vector<int>> result;
		if (nums.size() < 3)
			return result;
		sort(nums.begin(), nums.end());
		std::vector<int>::iterator left = nums.begin();
		std::vector<int>::iterator right = nums.end() - 1;
		while (right - left > 1)
		{
			int delta = 0 - *left - *right;
			if (delta < *left)
				left++;
			else if (delta > *right)
				right--;
			else
			{
				if (binary_search(left + 1, right, delta))
				{
					result.push_back({ *left, delta, *right });
					left++;
					right--;
				}
				else
				{
					if (delta > 0)
						left++;
					else
						right--;
				}
			}
		}
		return result;
	}
};