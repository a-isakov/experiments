package com.prep;

import java.util.Random;

public class PebblesSort {
    private final int n = 10;
    private int[] buckets;

    // 0 - red, 1 - white, 2 - blue
    private final int red = 0;
    private final int white = 1;
    private final int blue = 2;

    public PebblesSort() {
        buckets = new int[n];
        Random rand = new Random();
        for (int i = 0; i < n; i++) {
            buckets[i] = rand.nextInt(3);
        }
    }

    private void swap(final int i, final int j) {
        if (i == j)
            return;
        int q = buckets[i];
        buckets[i] = buckets[j];
        buckets[j] = q;
    }

    private int getColor(final int i) {
        return buckets[i];
    }

    public void doSort() {
        int redHighIndex = -1;
        while (getColor(redHighIndex + 1) == red) {
            redHighIndex++;
        }
        int blueLowIndex = n;
        while (getColor(blueLowIndex - 1) == blue) {
            blueLowIndex--;
        }
        int i = redHighIndex + 1;
        while (i < blueLowIndex) {
            int color = getColor(i);
            if (color == blue) {
                blueLowIndex--;
                swap(i, blueLowIndex);
            }
            else if (color == red) {
                if (i > redHighIndex + 1) {
                    redHighIndex++;
                    swap(i, redHighIndex);
                }
                else {
                    redHighIndex++;
                    swap(i, redHighIndex);
                }
                i++;
            }
            else {
                i++;
            }
        }
    }
}
