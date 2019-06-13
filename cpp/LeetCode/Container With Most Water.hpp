/*
Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

Note: You may not slant the container and n is at least 2.

Here was a picture
The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.

Example:

Input: [1,8,6,2,5,4,8,3,7]
Output: 49
*/

#include <vector>
#include <queue>
#include <unordered_set>

using namespace std;

class Solution {
public:
	int maxArea(vector<int>& height) {
		int max = -1;

		size_t left = 0;
		size_t right = height.size() - 1;
		while (left < right)
		{
			int min = height[left] < height[right] ? height[left] : height[right];
			int square = min * (right - left);
			if (square > max)
				max = square;

			while (height[left] == min && left < right)
				left++;
			while (height[right] == min && left < right)
				right--;
		}

		return max;
	}
};
