package com.prep;

import java.util.Arrays;
import java.util.Random;

public class EggDrop {
    public void main(final int floors) {
        Random rand = new Random();
        int floorX = rand.nextInt(floors); // where it crashes
        int[] a = new int[floors];
        for (int i = 0; i < floors; i++) {
            a[i] = i;
        }
        int crashFloorIndex = Arrays.binarySearch(a, 0, floors - 1, floorX); // This is it
    }
}
