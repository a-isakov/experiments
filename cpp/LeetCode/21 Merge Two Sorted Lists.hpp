/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */

/*
https://leetcode.com/problems/merge-two-sorted-lists/
Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.
Example:
Input: 1->2->4, 1->3->4
Output: 1->1->2->3->4->4
*/

class Solution {
public:
	struct ListNode {
		int val;
		ListNode* next;
		ListNode(int x) : val(x), next(nullptr) {}
	};
public:
	ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
		if (!l1 && !l2)
			return nullptr;
		else if (!l1)
			return l2;
		else if (!l2)
			return l1;

		ListNode* result = l1->val <= l2->val ? l1 : l2;
		ListNode* r = l1->val <= l2->val ? l2 : l1;
		ListNode* pl = result;
		ListNode* l = result->next;

		while (l && r)
		{
			if (l->val > r->val)
			{
				ListNode* tmp = r->next;
				pl->next = r;
				r->next = l;
				pl = pl->next;
				r = tmp;
			}
			else
			{
				l = l->next;
				pl = pl->next;
			}
		}
		if (r)
			pl->next = r;

		return result;
	}
};