/*
https://leetcode.com/problems/swap-nodes-in-pairs/
Given a linked list, swap every two adjacent nodes and return its head.
You may not modify the values in the list's nodes, only nodes itself may be changed.
Example:ListNode
Given 1->2->3->4, you should return the list as 2->1->4->3.
*/
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        if (!head)
            return nullptr;
        if (!head->next)
            return head;
        ListNode* first = head;
        ListNode* second = head->next;
        ListNode* new_head = second;
        ListNode* step_back = nullptr;
        while (first && first->next)
        {
            if (step_back)
                step_back->next = first->next;

            first->next = second->next;
            second->next = first;

            step_back = first;

            first = first->next;
            second = first ? first->next : nullptr;
        }

        return new_head;
    }
};