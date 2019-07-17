/*
Given a string, find the length of the longest substring without repeating characters.

Example 1:

Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 
Example 2:

Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
Example 3:

Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
*/

class Solution {
public:
    int lengthOfLongestSubstring(string s)
    {
        size_t longest = 0;
        size_t length = 0;
        size_t left = 0;
        unordered_map<char, size_t> m;
        for (size_t i = 0; i < s.length(); i++)
        {
            char c = s[i];
            if (!m.count(c)) // char is not in the map
                length++;
            else
            {
                size_t im = m[c];
                if (im < left)
                    length++;
                else
                {
                    // char is in the map
                    if (length > longest)
                        longest = length;

                    // restart sizing from new index
                    length = i - im;
                    left = im + 1;
                }
            }
            m[c] = i;
        }
        return length > longest ? length : longest;
    }
};
