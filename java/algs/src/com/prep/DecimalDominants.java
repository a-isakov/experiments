package com.prep;

import java.util.Arrays;

public class DecimalDominants {
    private int[] arr = {6, 2, 5, 0, 7, 2, 9, 4, 6, 8, 4, 3, 4, 1, 6, 5, 7, 8};

    public DecimalDominants () {
        Arrays.sort(arr);
        int freq = arr.length/10;
        int min = 0;
        int max = 1;
        while (min < arr.length && max < arr.length) {
            if (arr[max] == arr[min]) {
                max++;
            }
            else {
                if (max - min > freq) {
                    // This is the one
                }
                min = max;
                max++;
            }
        }
        if (max - min >= freq) {
            // This is the one
        }
    }
}
