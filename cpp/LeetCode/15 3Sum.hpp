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
		while (left < nums.size() - 2 && nums[left] <= 0)
		{
			size_t mid = left + 1;
			while (mid < nums.size() - 1)
			{
				int delta = 0 - nums[left] - nums[mid];
				// if right element less than delta, move middle element
				if (nums[right] < delta)
				{
					mid++;
					continue;
				}
				int* fnd = (int*)bsearch(&delta, &nums[mid + 1], right - mid, sizeof(int), compareInts);
				if(fnd)
					result.push_back({ nums[left], nums[mid], delta });
				mid++;
				// while middle element stays the same, move it
				while (nums[mid] == nums[mid - 1] && mid < nums.size() - 1)
					mid++;
			}
			left++;
			// while left element stays the same, move it
			while (nums[left] == nums[left - 1] && left < nums.size() - 1)
				left++;
		}
		return result;
	}
private:
	static int compareInts(const void* a, const void* b)
	{
		return (*(int*)a - *(int*)b);
	}
};