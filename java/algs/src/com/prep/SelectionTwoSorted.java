package com.prep;

public class SelectionTwoSorted {
    private int n1 = 4;
    private int[] a = {1, 3, 5, 7};
    private int n2 = 5;
    private int[] b = {2, 4, 6, 8, 10};
    private int k = 3;

    public SelectionTwoSorted() {
        int[] c = new int[n1 + n2];
        int ia = 0;
        int ib = 0;
        int ic = 0;
        while (ia < n1 && ib < n2) {
            if (a[ia] == b[ib]) {
                c[ic++] = a[ia++];
                c[ic++] = b[ib++];
            }
            else if (a[ia] < b[ib]) {
                c[ic++] = a[ia++];
            }
            else {
                c[ic++] = b[ib++];
            }
        }
        for (int i = ia; i < n1; i++) {
            c[ic++] = a[ia];
        }
        for (int i = ib; i < n2; i++) {
            c[ic++] = b[ib];
        }
        for (int i = n1 + n2; i > 0; i--) {
            if (n1 + n2 - i == k) {
                // This is Kth largest
            }
        }
    }
}
