package com.prep;

public class FScan {
    private int[] id;
    private int[] treeSize;
    private int[] maxNode;
    private boolean singleTree = false;

    public FScan(final int N) {
        id = new int[N];
        treeSize = new int[N];
        maxNode = new int[N];
        for (int i = 0; i < N; i++) {
            id[i] = i;
            treeSize[i] = 1;
            maxNode[i] = i;
        }
    }

    public boolean allFriends() {
        return singleTree;
    }

    public boolean connected(final int person1, final int person2) {
        if (singleTree)
            return true;
        return root(person1) == root(person2);
    }

    public void union(final int person1, final int person2) {
        if ((person1 == person2) || singleTree)
            return;
        int root1 = root(person1);
        int root2 = root(person2);
        if (root1 == root2)
            return;

        if (treeSize[root1] > treeSize[root2]) {
            id[root2] = root1;
            treeSize[root1] += treeSize[root2];
            if (treeSize[root1] == id.length)
                singleTree = true;
        }
        else {
            id[root1] = root2;
            treeSize[root2] += treeSize[root1];
            if (treeSize[root2] == id.length)
                singleTree = true;
        }

        int maxValue = Math.max(maxNode[root1], maxNode[root2]);
        maxNode[root1] = maxNode[root2] = maxValue;
    }

    public int find(final int i) {
        return maxNode[root(i)];
    }

    private int root(final int person) {
        int i = person;
        while (id[i] != i) {
            if (id[id[i]] != id[i]) {
                treeSize[id[i]] -= treeSize[i];
                id[i] = id[id[i]];
            }
            i = id[i];
        }
        return i;
    }
}
