#include <iostream>
#include <vector>

#include "24 Swap Nodes in Pairs.hpp"

void runTests()
{
	Solution sol;
	ListNode n1(1);
	ListNode n2(2);
	n1.next = &n2;
	ListNode n3(3);
	n2.next = &n3;
	//ListNode n4(4);
	//n3.next = &n4;
	sol.swapPairs(&n1);
	//vector<ListNode*> lists;
	//ListNode l11(1);
	//ListNode l14(4);
	//l11.next = &l14;
	//ListNode l15(5);
	//l14.next = &l15;
	//lists.push_back(&l11);
	//
	//ListNode l21(1);
	//ListNode l23(3);
	//l21.next = &l23;
	//ListNode l24(4);
	//l23.next = &l24;
	//lists.push_back(&l21);

	//ListNode l32(2);
	//ListNode l36(6);
	//l32.next = &l36;
	//lists.push_back(&l32);

	//ListNode* p = sol.mergeKLists(lists);

	//vector<ListNode*> lists2;
	//lists2.push_back(nullptr);
	//ListNode l41(-1);
	//ListNode l45(5);
	//l41.next = &l45;
	//ListNode l411(11);
	//l45.next = &l411;
	//lists2.push_back(&l41);

	//lists2.push_back(nullptr);
	//ListNode l56(6);
	//ListNode l510(10);
	//l56.next = &l510;
	//lists2.push_back(&l56);

	//p = sol.mergeKLists(lists2);

	//vector<ListNode*> lists3;
	//lists3.push_back(nullptr);
	//ListNode l61(-1);
	//ListNode l65(5);
	//l61.next = &l65;
	//lists3.push_back(&l61);

	//ListNode l71(1);
	//ListNode l74(4);
	//l71.next = &l74;
	//ListNode l76(6);
	//l74.next = &l76;
	//lists3.push_back(&l71);

	//ListNode l84(4);
	//ListNode l85(5);
	//l84.next = &l85;
	//ListNode l86(6);
	//l85.next = &l86;
	//lists3.push_back(&l84);

	//p = sol.mergeKLists(lists3);

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
