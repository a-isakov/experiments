package tests

import "fmt"

func removeElement(nums []int, val int) int {
	var newSize int = 0
	for i := 0; i < len(nums); i++ {
		if nums[i] != val {
			nums[newSize] = nums[i]
			newSize++
		}
	}
	return newSize
}

// TestRemoveElement solves https://leetcode.com/problems/remove-element/
func TestRemoveElement() {
	var arr = []int{3, 2, 2, 3}
	fmt.Printf("%d %v\n", removeElement(arr, 3), arr)
	arr = []int{0, 1, 2, 2, 3, 0, 4, 2}
	fmt.Printf("%d %v\n", removeElement(arr, 2), arr)
}
