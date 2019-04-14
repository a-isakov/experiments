package com.prep;

import java.util.Arrays;

public class PermutationCheck {
    public PermutationCheck(int[] a, int[] b) {
        boolean permutation = true;
        if (a.length != b.length) {
            permutation = false;
        }
        else {
            Arrays.sort(a);
            Arrays.sort(b);
            for (int i = 0; i < a.length; i++) {
                if (a[i] != b[i]) {
                    permutation = false;
                    break;
                }
            }
        }
        System.out.println(permutation ? "A permutation" : "Not a permutation");
    }
}
