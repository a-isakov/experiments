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
		size_t left = 0;
		size_t right = nums.size() - 1;

		//  vec = { -4, -1, -1, 0, 1, 2 };
		// 	vec = { -2, 0, 1, 1, 2 };
		while (right - left > 1)
		{
			int delta = 0 - nums[left] - nums[right];
			if (delta < nums[left])
				left++;
			else if (delta > nums[right])
				right--;
			else
			{
				int *fnd = (int *)bsearch(&delta, &nums[left + 1], right - left - 1, sizeof(int), compareints);
				if(fnd)
				{
					result.push_back({ nums[left], delta, nums[right] });
					if (fnd - &nums[left] > & nums[right] - fnd)
					{
						left++;
						while (nums[left] == nums[left - 1] && right > left)
							left++;
					}
					else
					{
						right--;
						while (nums[right] == nums[right + 1] && right > left)
							right--;
					}
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
private:
	static int compareints(const void* a, const void* b)
	{
		return (*(int*)a - *(int*)b);
	}
};