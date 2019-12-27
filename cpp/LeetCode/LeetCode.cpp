#include <iostream>
#include <vector>

#include "23 Merge k Sorted Lists.hpp"

void runTests()
{
	Solution sol;
	vector<ListNode*> lists;
	ListNode l11(1);
	ListNode l14(4);
	l11.next = &l14;
	ListNode l15(5);
	l14.next = &l15;
	lists.push_back(&l11);
	
	ListNode l21(1);
	ListNode l23(3);
	l21.next = &l23;
	ListNode l24(4);
	l23.next = &l24;
	lists.push_back(&l21);

	ListNode l32(2);
	ListNode l36(6);
	l32.next = &l36;
	lists.push_back(&l32);

	sol.mergeKLists(lists);
	//vector<string> vec = { };
	//std::cout << "Test 0 " << std::string(sol.generateParenthesis(0) == vec ? "passed" : "FAILED") << "\n";
	//vec = { "()" };
	//std::cout << "Test 1 " << std::string(sol.generateParenthesis(1) == vec ? "passed" : "FAILED") << "\n";
	//vec = { "(())", "()()" };
	//std::cout << "Test 2 " << std::string(sol.generateParenthesis(2) == vec ? "passed" : "FAILED") << "\n";
	//vec = { "((()))", "(()())", "(())()", "()(())", "()()()" };
	//std::cout << "Test 3 " << std::string(sol.generateParenthesis(3) == vec ? "passed" : "FAILED") << "\n";
}

int main()
{
	int i = INT_MIN;
	i = INT_MAX;
	runTests();
	std::cout << "Completed\n";
}
