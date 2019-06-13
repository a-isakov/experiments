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
		//int leftIndex = 0;
		//int rightIndex = height.size() - 1;
		int max = -1;

		priority_queue<pair<size_t, int>, vector<pair<size_t, int>>, CompareHeight> pq;
		for (size_t i = 0; i < height.size(); i++)
		{

			pq.push(pair<size_t, int>(i, height[i]));
		}

		// Pull min and heck against longest distance
		unordered_set<size_t> ignores;
		size_t lStart = 0;
		size_t rStart = height.size() - 1;
		while (!pq.empty())
		{
			pair<size_t, int> heightItem = pq.top();
			pq.pop();

			// Looking for left and right items for distances
			size_t lPos = lStart;
			while (ignores.find(lPos) != ignores.end())
				lPos++;
			if (lPos > lStart)
				lStart = lPos;
			size_t rPos = rStart;
			while (ignores.find(rPos) != ignores.end())
				rPos--;
			if (rPos < rStart)
				rStart = rPos;

			// Need to find maximum left and right distances
			size_t lDistance = heightItem.first - lPos;
			size_t rDistance = rPos - heightItem.first;
			if (lDistance == rDistance)
				continue;
			else
			{
				int square = (lDistance < rDistance) ? heightItem.second * rDistance : heightItem.second * lDistance;
				if (square > max)
					max = square;
			}

			ignores.insert(heightItem.first);
		}

		// This strategy doesn't work
		//pair<size_t, int> i1 = pq.top();
		//pq.pop();
		//pair<size_t, int> i2 = pq.top();
		//pq.pop();
		//max = min(i1.second, i2.second) * abs(int(i2.first) - int(i1.first));
		//while (!pq.empty())
		//{
		//	pair<size_t, int> iN = pq.top();
		//	pq.pop();

		//	int square1 = min(i1.second, iN.second) * abs(int(iN.first) - int(i1.first));
		//	int square2 = min(i2.second, iN.second) * abs(int(iN.first) - int(i2.first));
		//	if (square1 < square2)
		//	{
		//		i2 = iN;
		//		if (square2 > max)
		//			max = square2;
		//	}
		//	else
		//	{
		//		i1 = iN;
		//		if (square1 > max)
		//			max = square1;
		//	}
		//}

		return max;
	}
protected:
	struct CompareHeight
	{
		bool operator()(pair<size_t, int> const& p1, pair<size_t, int> const& p2) {
			return p1.second > p2.second; //  To implement minPQ
		}
	};

	//int min(int a, int b)
	//{
	//	return a < b ? a : b;
	//}
};
