package tests

import "fmt"

func strStr(haystack string, needle string) int {
	var needleLen int = len(needle)
	if needleLen == 0 {
		return 0
	}
	var bound int = len(haystack) - needleLen
	for i := 0; i <= bound; i++ {
		if haystack[i:i+needleLen] == needle {
			return i
		}
	}
	return -1
}

// TestStrStr solves https://leetcode.com/problems/implement-strstr
func TestStrStr() {
	fmt.Printf("Test 1 %t\n", strStr("hello", "ll") == 2)
	fmt.Printf("Test 2 %t\n", strStr("aaaaa", "bba") == -1)
	fmt.Printf("Test 3 %t\n", strStr("hello", "") == 0)
	fmt.Printf("Test 4 %t\n", strStr("", "") == 0)
	fmt.Printf("Test 5 %t\n", strStr("", "ll") == -1)
}
