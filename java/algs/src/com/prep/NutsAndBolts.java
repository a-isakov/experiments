package com.prep;

import java.util.Arrays;

public class NutsAndBolts {
    private int nutsCount = 10;
    private int boltsCount = 12;
    private int[] nuts = {6, 2, 8, 75, 4, 10, 7, 0, 5, 12};
    private int[] bolts = {6, 2, 22, 33, 8, 75, 10, 3, 7, 0, 5, 12};

    public NutsAndBolts() {
        Arrays.sort(nuts);
        Arrays.sort(bolts);
        int iNuts = 0;
        int iBolts = 0;
        while (iNuts < nutsCount && iBolts < boltsCount) {
            if (nuts[iNuts] == bolts[iBolts]) {
                // Pair found
                iNuts++;
                iBolts++;
            }
            else if (nuts[iNuts] > bolts[iBolts]) {
                iBolts++;
            }
            else {
                iNuts++;
            }
        }
    }
}
