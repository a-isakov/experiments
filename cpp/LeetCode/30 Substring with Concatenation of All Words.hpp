/*
https://leetcode.com/problems/substring-with-concatenation-of-all-words/
You are given a string, s, and a list of words, words, that are all of the same length.
Find all starting indices of substring(s) in s that is a concatenation of each word in words exactly once and without any intervening characters.
Example 1:
Input:
  s = "barfoothefoobarman",
  words = ["foo","bar"]
Output: [0,9]
Explanation: Substrings starting at index 0 and 9 are "barfoo" and "foobar" respectively.
The output order does not matter, returning [9,0] is fine too.
Example 2:
Input:
  s = "wordgoodgoodgoodbestword",
  words = ["word","good","best","word"]
Output: []
*/

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>

using namespace std;

class Solution {
public:
    string* str;
    size_t word_len;

    vector<int> findSubstring(string s, vector<string>& words) {
        vector<int> result;
        if (!words.size())
            return result;
        word_len = words[0].length();
        size_t max_pos = s.length() - word_len * words.size();
        str = &s;
        unordered_map<string, size_t> availables;
        for (string& word : words)
            availables[word]++;
        for (auto& word_item : availables)
        {
            if (!word_item.second)
                continue;
            word_item.second--;
            size_t pos = s.find(word_item.first.c_str(), 0);
            while (pos != string::npos)
            {
                if (pos > max_pos)
                    break;
                if (CheckDeeper(pos, availables))
                    result.push_back((int)pos);
                pos = s.find(word_item.first.c_str(), pos + 1);
            }
            word_item.second++;
        }
        return result;
    }

    inline bool CheckDeeper(size_t pos, unordered_map<string, size_t>& availables)
    {
        bool empty = true;
        for(auto& it : availables)
        {
            if (it.second)
            {
                empty = false;
                break;
            }
        }
        if (empty)
            return true;
        string sub = str->substr(pos + word_len, word_len);
        size_t& count = availables[sub];
        if (count)
        {
            count--;
            bool res = CheckDeeper(pos + word_len, availables);
            count++;
            return res;
        }
        return false;
    }

    void test()
    {
        vector<string> vec = { "foo", "bar" };
        vector<int> res = { 9, 0 };
        std::cout << "Test 1 " << std::string(findSubstring("barfoothefoobarman", vec) == res ? "passed" : "FAILED") << "\n";
        vec = { "word","good","best","word" };
        res = {};
        std::cout << "Test 2 " << std::string(findSubstring("wordgoodgoodgoodbestword", vec) == res ? "passed" : "FAILED") << "\n";
        vec = { "the", "foo", "bar" };
        res = { 6, 0 };
        std::cout << "Test 3 " << std::string(findSubstring("barfoothefoobarman", vec) == res ? "passed" : "FAILED") << "\n";
        vec = { "word","good","best","good" };
        res = { 8 };
        std::cout << "Test 4 " << std::string(findSubstring("wordgoodgoodgoodbestword", vec) == res ? "passed" : "FAILED") << "\n";
        vec = { "foo","bar" };
        res = { 0, 9 };
        std::cout << "Test 5 " << std::string(findSubstring("barfoothefoobarman", vec) == res ? "passed" : "FAILED") << "\n";
        std::cout << "Completed\n";
    }
};