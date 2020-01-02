/*
https://leetcode.com/problems/merge-k-sorted-lists/
Merge k sorted linked lists and return it as one sorted list. Analyze and describe its complexity.
Example:
Input:
[
  1->4->5,
  1->3->4,
  2->6
]
Output: 1->1->2->3->4->4->5->6
*/

#include <vector>
#include <algorithm>

using namespace std;

struct ListNode {
	int val;
	ListNode* next;
	ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
	ListNode* mergeKLists(vector<ListNode*>& lists) {
		if (lists.empty())
			return nullptr;
		if (lists.size() == 1)
			return lists[0];
		sort(lists.begin(), lists.end(), [](ListNode* l1, ListNode* l2)
			{
				if (l1 == nullptr)
					return false;
				else if (l2 == nullptr)
					return true;
				else
					return l1->val < l2->val;
			});
		if (lists[1] == nullptr)
			return lists[0];
		ListNode* result = lists[0];
		ListNode* pl = result;
		ListNode* l = pl->next;

		size_t i = 1;
		while (lists[1])
		{
			if (l != nullptr && l->val <= lists[1]->val)
			{
				l = l->next;
				pl = pl->next;
			}
			else if (l == nullptr)
			{
				pl->next = lists[1];
				l = pl->next;
				lists[1] = nullptr;
				resort(lists);
			}
			else
			{
				ListNode* tmp = lists[1]->next;
				pl->next = lists[1];
				lists[1]->next = l;
				pl = pl->next;
				lists[1] = tmp;
				resort(lists);
			}
		}

		return result;
	}
private:
	void resort(vector<ListNode*>& lists)
	{
		size_t index = 1;
		while (index + 1 < lists.size() && lists[index + 1] != nullptr && (lists[index] == nullptr || lists[index]->val > lists[index + 1]->val))
		{
			ListNode* tmp = lists[index];
			lists[index] = lists[index + 1];
			lists[index + 1] = tmp;
			index++;
		}
	}
};