package com.prep;

import java.util.ArrayList;
import java.util.Arrays;

public class TwoSetsIntersection {
    private int[] a = {6, 2, 8, 4, 7, 0, 5};
    private int[] b = {1, 2, 3, 5, 7, 8, 9};
    private ArrayList<Integer> result;
    private int n = 7;

    public TwoSetsIntersection() {
        result = new ArrayList<Integer>();
        Arrays.sort(a);
        Arrays.sort(b);
        int indA = 0;
        int indB = 0;
        while (indA < n && indB < n) {
            if (a[indA] == b[indB]) {
                result.add(a[indA]);
                indA++;
            }
            else {
                if (a[indA] < b[indB]) {
                    indA++;
                }
                else {
                    indB++;
                }
            }
        }
    }

    public void PrintIntersection() {
        for (int a: result) {
            System.out.println(a);
        }
    }

    public static void main(String[] args) {
        TwoSetsIntersection ts = new TwoSetsIntersection();
        ts.PrintIntersection();
    }
}
