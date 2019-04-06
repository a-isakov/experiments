package com.prep;

import java.util.Arrays;

public class BitonicArray {
    private int getBitPoint(final int[] a, final int leftIndex, final int rightIndex) {
        if (leftIndex <= rightIndex)
        {
            int mid = (leftIndex + rightIndex) / 2;

            if (a[mid - 1] < a[mid] && a[mid] > a[mid + 1])
                return mid;

            if (a[mid] < a[mid + 1])
                return getBitPoint(a, mid + 1, rightIndex);
            else
                return getBitPoint(a, leftIndex, mid - 1);
        }

        return -1;
    }

    public void main(final int value2find) {
        int[] a = new int[] {6, 7, 8, 11, 9, 5, 2, 1};
        int bitPoint = getBitPoint(a, 0, a.length - 1);
        int index = Arrays.binarySearch(a, 0, bitPoint, value2find);
        if (index < 0) {
            index = Arrays.binarySearch(a, bitPoint, a.length - 1, value2find);
            if (index > 0) {
                // Here's it
            }
        }
    }
}
