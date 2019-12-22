#include <iostream>
#include <vector>

#include "19 Remove Nth Node From End of List.hpp"

void testRemoveNth()
{
	Solution sol;
	Solution::ListNode node1(1);
	Solution::ListNode node2(2);
	node1.next = &node2;
	//Solution::ListNode node3(3);
	//node2.next = &node3;
	//Solution::ListNode node4(4);
	//node3.next = &node4;
	//Solution::ListNode node5(5);
	//node4.next = &node5;
	sol.removeNthFromEnd(&node1, 2);
	//vector<string> vec = { "ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf" };
	//std::cout << "Test 1 " << std::string(sol.letterCombinations("23") == vec ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	testRemoveNth();
	std::cout << "Hello World!\n";
}
