/*
https://leetcode.com/problems/linked-list-cycle/
Given head, the head of a linked list, determine if the linked list has a cycle in it.
There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.
Return true if there is a cycle in the linked list. Otherwise, return false.
*/

#include <iostream>

using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

class Solution {
public:
    bool hasCycle(ListNode* head) {
        if (!head)
            return false;
        ListNode* node = head;
        while (node)
        {
            size_t addr = (size_t)node->next;
            if (addr & 0x8000000000000000)
                return true;
            ListNode* nextNode = node->next;
            addr = (size_t)node->next | 0x8000000000000000;
            node->next = (ListNode*)addr;
            node = nextNode;
        }
        return false;
    }

    void test()
    {
        std::cout << "Test 1 " << std::string(!hasCycle(nullptr) ? "passed" : "FAILED") << "\n";
        ListNode n11(3);
        ListNode n12(2);
        ListNode n13(0);
        ListNode n14(-4);
        n11.next = &n12;
        n12.next = &n13;
        n13.next = &n14;
        std::cout << "Test 2 " << std::string(!hasCycle(&n11) ? "passed" : "FAILED") << "\n";
        n14.next = &n12;
        std::cout << "Test 3 " << std::string(hasCycle(&n11) ? "passed" : "FAILED") << "\n";
    }
};