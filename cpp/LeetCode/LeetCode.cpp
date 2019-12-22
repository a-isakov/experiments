#include <iostream>
#include <vector>

#include "21 Merge Two Sorted Lists.hpp"

void testMerge2()
{
	Solution::ListNode node11(1);
	Solution::ListNode node12(2);
	node11.next = &node12;
	Solution::ListNode node14(4);
	node12.next = &node14;
	Solution::ListNode node21(1);
	Solution::ListNode node23(3);
	node21.next = &node23;
	Solution::ListNode node24(4);
	node23.next = &node24;
	Solution sol;
	sol.mergeTwoLists(&node11, &node21);
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testMerge2();
	std::cout << "Hello World!\n";
}
