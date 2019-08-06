/*
https://leetcode.com/problems/lexicographical-numbers/
Given an integer n, return 1 - n in lexicographical order.
For example, given 13, return: [1,10,11,12,13,2,3,4,5,6,7,8,9].
Please optimize your algorithm to use less time and space. The input size may be as large as 5,000,000.
*/

#include <vector>
#include <stack>
#include <queue>

using namespace std;

class Solution {
public:
	vector<int> lexicalOrder(int n) {
		vector<int> v(n);
		if (n < 10)
		{
			for (int i = 0; i < n; i++)
				v[i] = i + 1;
		}
		else
		{
			// pair<int, int>: first - value, second - multiplier
			auto cmp = [](pair<int, int>& left, pair<int, int>& right) {
				// Check if right is less
				if (left.second == right.second)
					return right.first < left.first;
				int l = left.second > right.second ? left.first : left.first * (right.second / left.second);
				int r = left.second < right.second ? right.first : right.first * (left.second / right.second);
				if (l == r)
					return right.second < left.second;

				return r < l;
			};

			priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> pq(cmp);
			for (int i = 1; i <= n; i++)
			{
				int multiplier = 1;
				int ci = i;
				while (ci)
				{
					multiplier *= 10;
					ci /= 10;
				}
				pq.emplace(pair<int, int>(i, multiplier/10));
			}

			size_t index = 0;
			while (!pq.empty())
			{
				v[index++] = pq.top().first;
				pq.pop();
			}
		}

		return v;
	}
};