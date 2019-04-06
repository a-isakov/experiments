package com.prep;

import java.util.Random;
import java.util.Arrays;

public class ThreeSum {
    public void main(final int n) {
        Random rand = new Random();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = rand.nextInt();
        }
        Arrays.sort(a);

        for (int i = 0; i < n - 2; i++) {
            for (int j = i + 1; j < n - 1; j++) {
                int index = Arrays.binarySearch(a, j + 1, n, 0 - a[i] - a[j]);
                if (index > 0) {
                    // Here's the result
                }
            }
        }
    }
}
