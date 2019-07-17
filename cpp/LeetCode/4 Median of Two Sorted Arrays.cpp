/*
There are two sorted arrays nums1 and nums2 of size m and n respectively.

Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

You may assume nums1 and nums2 cannot be both empty.

Example 1:

nums1 = [1, 3]
nums2 = [2]

The median is 2.0
Example 2:

nums1 = [1, 2]
nums2 = [3, 4]

The median is (2 + 3)/2 = 2.5
*/
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> merge(nums1.size() + nums2.size());
        int i1 = 0;
        int i2 = 0;
        int i = 0;
        while (i1 < nums1.size() || i2 < nums2.size())
        {
            if (i1 >= nums1.size())
                merge[i++] = nums2[i2++];
            else if (i2 >= nums2.size())
                merge[i++] = nums1[i1++];
            else if (nums1[i1] < nums2[i2])
                merge[i++] = nums1[i1++];
            else
                merge[i++] = nums2[i2++];
        }
        int mid = merge.size()/2;
        if (merge.size()%2)
            return (double)merge[mid];
        else
            return ((double)merge[mid - 1] + (double)merge[mid])/2;
    }
};
