package tests

import "fmt"

func searchInsert(nums []int, target int) int {
	for i := 0; i < len(nums); i++ {
		if nums[i] >= target {
			return i
		}
	}
	return len(nums)
}

// TestSearchInsert solves https://leetcode.com/problems/search-insert-position/
func TestSearchInsert() {
	fmt.Printf("Test 1 %t\n", searchInsert([]int{1, 3, 5, 6}, 1) == 0)
	fmt.Printf("Test 2 %t\n", searchInsert([]int{1, 3, 5, 6}, 5) == 2)
	fmt.Printf("Test 3 %t\n", searchInsert([]int{1, 3, 5, 6}, 2) == 1)
	fmt.Printf("Test 4 %t\n", searchInsert([]int{1, 3, 5, 6}, 7) == 4)
	fmt.Printf("Test 5 %t\n", searchInsert([]int{1, 3, 5, 6}, 0) == 0)
	fmt.Printf("Test 6 %t\n", searchInsert([]int{1, 3, 5, 6}, 6) == 3)
	fmt.Printf("Test 7 %t\n", searchInsert([]int{1, 3, 5, 6}, 1) == 0)
}
