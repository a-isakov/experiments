/*
https://leetcode.com/problems/unique-paths/
A robot is located at the top-left corner of a m x n grid (marked 'Start' in the diagram below).
The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid (marked 'Finish' in the diagram below).
How many possible unique paths are there?

Above is a 7 x 3 grid. How many possible unique paths are there?
Note: m and n will be at most 100.
Example 1:
Input: m = 3, n = 2
Output: 3
Explanation:
From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Right -> Down
2. Right -> Down -> Right
3. Down -> Right -> Right
Example 2:
Input: m = 7, n = 3
Output: 28
*/

/*
Runtime: 0 ms, faster than 100.00%. Next time 4ms
Memory Usage: 8.3 MB, less than 70.14%
*/

#include <vector>
#include <numeric>

using namespace std;

class Solution {
public:
	int uniquePaths(int m, int n) {
		if (!m || !n)
			return 0;
		if (n == 1 || m == 1)
			return 1;
		if (m == 2)
			return n;
		if (n == 2)
			return m;
		int result = n;
		vector<int> helper2(n - 1);
		vector<int> helper1(n - 1, 1);
		for (int x = 2; x < m; x++)
		{
			helper2[0] = 1;
			for (int y = 1; y < n - 1; y++)
			{
				helper2[y] = accumulate(helper1.begin(), helper1.begin() + y + 1, 0);
			}
			helper1 = helper2;
			result += accumulate(helper1.begin(), helper1.end(), 0);
		}
		
		return result;
	}
};
