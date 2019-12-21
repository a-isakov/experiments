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
		for (size_t left = 0; left < nums.size() - 2; left++)
		{
			if (nums[left] > 0)
				break;
			if (left > 0 && nums[left - 1] == nums[left])
				continue;
			int delta = 0 - nums[left]; // the sum of the rest two numbers
			size_t mid = left + 1;
			size_t right = nums.size() - 1;
			while (mid < right)
			{
				int restSum = nums[mid] + nums[right];
				if (restSum == delta)
				{
					result.push_back({ nums[left], nums[mid], nums[right] });
					// shift left iterator skipping duplicates
					do
					{
						mid++;
					} while (mid < right && nums[mid] == nums[mid - 1]);
					// shift right iterator skipping duplicates
					do
					{
						right--;
					} while (mid < right && nums[right] == nums[right + 1]);
				}
				else if (restSum < delta)
				{
					mid++;
				}
				else
				{
					right--;
				}
			}
		}
		return result;
	}
private:
	static int compareInts(const void* a, const void* b)
	{
		return (*(int*)a - *(int*)b);
	}
	size_t getLeftMidPosition(vector<int>& nums, const size_t left, const size_t right, const int delta)
	{
		if (right - left < 2)
			return left;
		size_t mid = (left + right) / 2;
		if (nums[mid] > delta)
			return getLeftMidPosition(nums, left, mid, delta);
		return getLeftMidPosition(nums, mid, right, delta);
	}
};