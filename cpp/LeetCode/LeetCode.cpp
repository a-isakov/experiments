// LeetCode.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <vector>

//#include "Regular Expression Matching.hpp"
//void testRegExp()
//{
//	std::string resultString;
//	Solution sol;
//	resultString = sol.isMatch("aa", "a") ? "FAILED" : "passed"; // Should be false
//	std::cout << "Test 1 " << resultString << "\n";
//
//	resultString = sol.isMatch("aa", "a*") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 2 " << resultString << "\n";
//
//	resultString = sol.isMatch("ab", ".*") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 3 " << resultString << "\n";
//
//	resultString = sol.isMatch("aab", "c*a*b") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 4 " << resultString << "\n";
//
//	resultString = sol.isMatch("mississippi", "mis*is*p*.") ? "FAILED" : "passed"; // Should be false
//	std::cout << "Test 5 " << resultString << "\n";
//
//	resultString = sol.isMatch("ab", ".*c") ? "FAILED" : "passed"; // Should be false
//	std::cout << "Test 6 " << resultString << "\n";
//
//	resultString = sol.isMatch("aaa", "a*a") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 7 " << resultString << "\n";
//
//	resultString = sol.isMatch("aaa", "ab*a*c*a") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 8 " << resultString << "\n";
//
//	resultString = sol.isMatch("aaa", "aaaa") ? "FAILED" : "passed"; // Should be false
//	std::cout << "Test 9 " << resultString << "\n";
//
//	resultString = sol.isMatch("a", "ab*") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 10 " << resultString << "\n";
//
//	resultString = sol.isMatch("bbbba", ".*a*a") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 11 " << resultString << "\n";
//
//	resultString = sol.isMatch("ab", ".*..") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 12 " << resultString << "\n";
//
//	resultString = sol.isMatch("a", "") ? "FAILED" : "passed"; // Should be false
//	std::cout << "Test 13 " << resultString << "\n";
//
//	resultString = sol.isMatch("", "") ? "passed" : "FAILED"; // Should be true
//	std::cout << "Test 14 " << resultString << "\n";
//}

//#include "Container With Most Water.hpp"
//void testContainer()
//{
//	Solution sol;
//	std::string resultString;
//	std::vector<int> v = { 1, 8, 6, 2, 5, 4, 8, 3, 7 };
//	std::cout << "Test 1 " << std::string(sol.maxArea(v) == 49 ? "passed" : "FAILED") << "\n";
//
//	v = { 1, 2, 4, 3 };
//	std::cout << "Test 2 " << std::string(sol.maxArea(v) == 4 ? "passed" : "FAILED") << "\n";
//
//	v = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
//	std::cout << "Test 3 " << std::string(sol.maxArea(v) == 25 ? "passed" : "FAILED") << "\n";
//
//	v = { 6, 4, 3, 1, 4, 6, 99, 62, 1, 2, 6 };
//	std::cout << "Test 4 " << std::string(sol.maxArea(v) == 62 ? "passed" : "FAILED") << "\n";
//
//	v = { 1, 1 };
//	std::cout << "Test 5 " << std::string(sol.maxArea(v) == 1 ? "passed" : "FAILED") << "\n";
//}

//#include "Binary Number with Alternating Bits.hpp"
//void testBits()
//{
//	Solution sol;
//	std::cout << "Test 1 " << std::string(sol.hasAlternatingBits(5) ? "passed" : "FAILED") << "\n";
//	std::cout << "Test 2 " << std::string(!sol.hasAlternatingBits(7) ? "passed" : "FAILED") << "\n";
//	std::cout << "Test 3 " << std::string(!sol.hasAlternatingBits(11) ? "passed" : "FAILED") << "\n";
//	std::cout << "Test 4 " << std::string(sol.hasAlternatingBits(10) ? "passed" : "FAILED") << "\n";
//	std::cout << "Test 5 " << std::string(!sol.hasAlternatingBits(4) ? "passed" : "FAILED") << "\n";
//	std::cout << "Test 6 " << std::string(!sol.hasAlternatingBits(8) ? "passed" : "FAILED") << "\n";
//}

#include "Smallest Subtree with all the Deepest Nodes.hpp"
void testSmallestTree()
{
	Solution sol;
	std::vector<int> v = { 3,5,1,6,2,0,8,INT32_MIN,INT32_MIN,7,4 };
	std::vector<int> vc = { 2,7,4 };
	std::cout << "Test 1 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";
	v = { 1 };
	vc = { 1 };
	std::cout << "Test 2 " << std::string(sol.serialize(sol.subtreeWithAllDeepest(sol.buildTree(v))) == vc ? "passed" : "FAILED") << "\n";
	
}

int main()
{
	testSmallestTree();
	std::cout << "Hello World!\n";
}
