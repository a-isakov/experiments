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
		auto cmp = [](int left, int right) {
			int l = left;
			int r = right;
			queue<int> lQ;
			queue<int> rQ;
			while (l)
			{
				int d = l % 10;
				lQ.push(d);
				l /= 10;
			}
			while (r)
			{
				int d = r % 10;
				rQ.push(d);
				r /= 10;
			}

			while (!lQ.empty() && !rQ.empty())
			{
				int lD = lQ.front();
				lQ.pop();
				int rD = rQ.front();
				rQ.pop();
				if (lD < rD)
					return true;
				else if (lD > rD)
					return false;
			}
			if (lQ.empty())
				return true;

			return false;
		};
		priority_queue<int, vector<int>, decltype(cmp)> pq(cmp);
		for (int i = 1; i <= n; i++)
		{
			pq.push(i);
		}

		vector<int> v(pq.size());
		size_t index = 0;
		while (!pq.empty())
		{
			v[index++] = pq.top();
			pq.pop();
		}

		return v;
	}
};