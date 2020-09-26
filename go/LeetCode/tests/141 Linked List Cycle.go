package tests

import "fmt"

// ListNode is a simple linked list
type ListNode struct {
	Val  int
	Next *ListNode
}

// solves https://leetcode.com/problems/linked-list-cycle/
func hasCycleSlow(head *ListNode) bool {
	if head != nil {
		var addrs map[*ListNode]bool = make(map[*ListNode]bool)
		var node *ListNode = head
		for node != nil {
			addrs[node] = true
			if node.Next != nil && addrs[node.Next] {
				return true
			}
			node = node.Next
		}
	}
	return false
}

// solves https://leetcode.com/problems/linked-list-cycle/
func hasCycle(head *ListNode) bool {
	if head != nil {
		var slowNode *ListNode = head
		var fastNode *ListNode = head

		for slowNode != nil && fastNode != nil {
			if slowNode.Next == nil || fastNode.Next == nil {
				return false
			}

			slowNode = slowNode.Next
			fastNode = fastNode.Next.Next

			if slowNode == fastNode {
				return true
			}
		}
	}
	return false
}

// TestHasCycle tests hasCycle
func TestHasCycle() {
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
	fmt.Printf("Test 1 %t\n", hasCycle(&n11) == false)
	n14.Next = &n12
	fmt.Printf("Test 2 %t\n", hasCycle(&n11) == true)

	var n21 ListNode
	var n22 ListNode
	n21.Val = 1
	n21.Next = &n22
	n22.Val = 2
	n22.Next = nil
	fmt.Printf("Test 3 %t\n", hasCycle(&n21) == false)
	n22.Next = &n21
	fmt.Printf("Test 4 %t\n", hasCycle(&n21) == true)

	var n31 ListNode
	n31.Val = 1
	n31.Next = nil
	fmt.Printf("Test 5 %t\n", hasCycle(&n31) == false)
	n31.Next = &n31
	fmt.Printf("Test 6 %t\n", hasCycle(&n31) == true)

	fmt.Printf("Test 7 %t\n", hasCycle(nil) == false)
}
