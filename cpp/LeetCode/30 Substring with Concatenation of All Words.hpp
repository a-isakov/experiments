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
    vector<int> findSubstring(string s, vector<string>& words) {
        vector<int> result;
        if (!words.size())
            return result;
        size_t len = words[0].length();
        unordered_map<string, size_t> availables;
        unordered_set<string> distinct_words;
        for (string word : words)
        {
            availables[word]++;
            distinct_words.insert(word);
        }
        for (string word : distinct_words)
        {
            availables[word]--;
            size_t pos = s.find(word);
            while (pos != string::npos)
            {
                if (CheckDeeper(s, pos, len, availables, result))
                    result.push_back((int)pos);
                pos = s.find(word, pos + 1);
            }
            availables[word]++;
        }
        return result;
    }

    inline bool CheckDeeper(string& s, size_t pos, size_t len, unordered_map<string, size_t>& availables, vector<int>& result)
    {
        bool empty = true;
        for(auto it : availables)
        {
            if (it.second)
            {
                empty = false;
                break;
            }
        }
        if (empty)
            return true;
        string sub = s.substr(pos + len, len);
        if (availables[sub])
        {
            availables[sub]--;
            bool res = CheckDeeper(s, pos + len, len, availables, result);
            availables[sub]++;
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
        std::cout << "Completed\n";
    }
};