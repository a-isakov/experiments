package tests

import "fmt"

// ListNode is a simple linked list
// type ListNode struct {
// 	Val  int
// 	Next *ListNode
// }

// solves https://leetcode.com/problems/linked-list-cycle-ii/
func detectCycle(head *ListNode) *ListNode {
	if head != nil {
		var addrs map[*ListNode]bool = make(map[*ListNode]bool)
		var node *ListNode = head
		for node != nil {
			addrs[node] = true
			if node.Next != nil && addrs[node.Next] {
				return node.Next
			}
			node = node.Next
		}
	}
	return nil
}

// TestHasCycle2 tests hasCycle
func TestHasCycle2() {
	var n11 ListNode
	var n12 ListNode
	var n13 ListNode
	var n14 ListNode
	n11.Val = 3
	n11.Next = &n12
	n12.Val = 2
	n12.Next = &n13
	n13.Val = 0
	n13.Next = &n14
	n14.Val = -4
	n14.Next = nil
	fmt.Printf("Test 1 %t\n", detectCycle(&n11) == nil)
	n14.Next = &n12
	fmt.Printf("Test 2 %t\n", detectCycle(&n11) == &n12)

	var n21 ListNode
	var n22 ListNode
	n21.Val = 1
	n21.Next = &n22
	n22.Val = 2
	n22.Next = nil
	fmt.Printf("Test 3 %t\n", detectCycle(&n21) == nil)
	n22.Next = &n21
	fmt.Printf("Test 4 %t\n", detectCycle(&n21) == &n21)

	var n31 ListNode
	n31.Val = 1
	n31.Next = nil
	fmt.Printf("Test 5 %t\n", detectCycle(&n31) == nil)
	n31.Next = &n31
	fmt.Printf("Test 6 %t\n", detectCycle(&n31) == &n31)

	fmt.Printf("Test 7 %t\n", detectCycle(nil) == nil)
}
