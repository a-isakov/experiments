/*
https://leetcode.com/problems/next-permutation/
Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers.
If such arrangement is not possible, it must rearrange it as the lowest possible order (ie, sorted in ascending order).
The replacement must be in-place and use only constant extra memory.
Here are some examples. Inputs are in the left-hand column and its corresponding outputs are in the right-hand column.
1,2,3 -> 1,3,2
3,2,1 -> 1,2,3
1,1,5 -> 1,5,1
*/

#include <vector>
#include <queue>

using namespace std;

class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        if (nums.empty())
            return;
        //priority_queue<int, std::vector<int>, std::greater<int>> pq; // по возрастанию. top получит меньший
        priority_queue<int, std::vector<int>, std::less<int>> pq; // по убыванию. top получит больший
        size_t index = 0;
        bool action = false;
        for (size_t i = 0; i < nums.size() - 1; i++)
        {
            size_t l = nums.size() - i - 2;
            size_t r = nums.size() - i - 1;
            pq.push(nums[r]);
            if (nums[l] < nums[r])
            {
                action = true;
                index = l;
                break;
            }
        }
        if (!action)
            pq.push(nums[0]);
        else
        {
            int tmp = nums[index];
            nums[index++] = pq.top();
            pq.pop();
            pq.push(tmp);
        }
        for (size_t i = 0; i < nums.size() - index; i++)
        {
            //nums[i + index] = pq.top();
            nums[nums.size() - i - 1] = pq.top();
            pq.pop();
        }
    }

    void test()
    {
        vector<int> in = { 1, 2, 3 };
        nextPermutation(in);
        cout << "Test 1 " << string(in == vector<int>({ 1, 3, 2 }) ? "passed" : "FAILED") << "\n";

        in = { 3, 2, 1 };
        nextPermutation(in);
        cout << "Test 2 " << string(in == vector<int>({ 1, 2, 3 }) ? "passed" : "FAILED") << "\n";

        in = { 1, 1, 5 };
        nextPermutation(in);
        cout << "Test 3 " << string(in == vector<int>({ 1, 5, 1 }) ? "passed" : "FAILED") << "\n";

        in = { 1, 0, 9 };
        nextPermutation(in);
        cout << "Test 4 " << string(in == vector<int>({ 1, 9, 0 }) ? "passed" : "FAILED") << "\n";

        in = { 1, 3, 2 };
        nextPermutation(in);
        cout << "Test 5 " << string(in == vector<int>({ 2, 1, 3 }) ? "passed" : "FAILED") << "\n";

        in = { 1 };
        nextPermutation(in);
        cout << "Test 6 " << string(in == vector<int>({ 1 }) ? "passed" : "FAILED") << "\n";

        in = {};
        nextPermutation(in);
        cout << "Test 7 " << string(in == vector<int>({}) ? "passed" : "FAILED") << "\n";

        in = { 2, 3, 1 };
        nextPermutation(in);
        cout << "Test 8 " << string(in == vector<int>({ 3, 1, 2 }) ? "passed" : "FAILED") << "\n";
    }
};