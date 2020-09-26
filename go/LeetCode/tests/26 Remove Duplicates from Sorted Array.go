package tests

import "fmt"

func removeDuplicates(nums []int) int {
	if len(nums) <= 1 {
		return len(nums)
	}
	var counter int = 1
	for i := 1; i < len(nums); i++ {
		if nums[i-1] != nums[i] {
			nums[counter] = nums[i]
			counter++
		}
	}
	return counter
}

// TestRemoveDuplicates solves https://leetcode.com/problems/remove-duplicates-from-sorted-array/
func TestRemoveDuplicates() {
	var arr = []int{1, 1, 2}
	fmt.Printf("%d %v\n", removeDuplicates(arr), arr)
	arr = []int{0, 0, 1, 1, 1, 2, 2, 3, 3, 4}
	fmt.Printf("%d %v\n", removeDuplicates(arr), arr)
	arr = []int{1}
	fmt.Printf("%d %v\n", removeDuplicates(arr), arr)
	arr = []int{}
	fmt.Printf("%d %v\n", removeDuplicates(arr), arr)
}
