package com.prep;

import java.util.Random;

public class SuccessorWithDelete {
    private int[] givenSet;
    private int[][] preparedSet; // Index - position of the element in the set, value0 - index of the lower element, value1 - index of the higher or equal element
    private boolean setPrepared = false;

    public SuccessorWithDelete(final int N) {
        givenSet = new int[N];
        preparedSet = new int[N][2];
        Random rand = new Random();
        for (int i = 0; i < N; i++) {
            givenSet[i] = rand.nextInt(N);
            preparedSet[i][0] = preparedSet[i][1] = i;
        }
        prepareSet();
    }

    protected void insert(final int newItemIndex, final int intoIndex) {
        int newValue = givenSet[newItemIndex];
        int intoValue = givenSet[intoIndex];
        if (newValue > intoValue) {
            if (preparedSet[intoIndex][1] != intoIndex) {
                int nextValue = givenSet[preparedSet[intoIndex][1]];
                if (newValue > nextValue)
                    insert(newItemIndex, preparedSet[intoIndex][1]);
                else {
                    preparedSet[newItemIndex][0] = intoIndex;
                    preparedSet[newItemIndex][1] = preparedSet[intoIndex][1];
                    preparedSet[preparedSet[intoIndex][1]][0] = newItemIndex;
                    preparedSet[intoIndex][1] = newItemIndex;
                }
            }
            else {
                // intoValue is max
                preparedSet[intoIndex][1] = newItemIndex;
                preparedSet[newItemIndex][0] = intoIndex;
            }
        }
        else if (newValue == intoValue) {
            preparedSet[newItemIndex][0] = intoIndex;
            preparedSet[newItemIndex][1] = preparedSet[intoIndex][1];
            preparedSet[preparedSet[intoIndex][1]][0] = newItemIndex;
            preparedSet[intoIndex][1] = newItemIndex;
        }
        else {
            if (preparedSet[intoIndex][0] != intoIndex) {
                int prevValue = givenSet[preparedSet[intoIndex][0]];
                if (newValue < prevValue)
                    insert(newItemIndex, preparedSet[intoIndex][0]);
                else {
                    preparedSet[newItemIndex][0] = preparedSet[intoIndex][0];
                    preparedSet[newItemIndex][1] = intoIndex;
                    preparedSet[preparedSet[intoIndex][0]][1] = newItemIndex;
                    preparedSet[intoIndex][0] = newItemIndex;
                }
            }
            else {
                // intoValue is min
                preparedSet[intoIndex][0] = newItemIndex;
                preparedSet[newItemIndex][1] = intoIndex;
            }
        }
    }

    protected void prepareSet() {
        if (setPrepared)
            return;

        for (int i = 1; i < givenSet.length; i++) {
            insert(i, i-1);
        }

        setPrepared = true;
    }

    public int getSuccessor(final int x) {
        prepareSet();

        int index = 0;
        while (index < givenSet.length) {
            if (givenSet[index] != -1)
                break;
            index++;
        }
        if (index == givenSet.length)
            return -1; // Set is empty

        while (true) {
            if (givenSet[index] == x)
                break;
            else if (givenSet[index] < x) {
                if (preparedSet[index][1] == index)
                    break;
                else
                    index = preparedSet[index][1];
            }
            else {
                if (preparedSet[index][0] == index)
                    break;
                else
                    index = preparedSet[index][0];
            }
        }

        return givenSet[index] < x ? -1 : givenSet[index];
    }

    public boolean remove(final int x) {
        prepareSet();
        boolean result = false;

        int index = 0;
        while (index < givenSet.length) {
            if (givenSet[index] != -1)
                break;
            index++;
        }
        if (index == givenSet.length)
            return result; // Set is empty

        while (true) {
            if (givenSet[index] == x) {
                if (preparedSet[index][0] == index && preparedSet[index][1] == index) {
                    // Last item
                }
                else if (preparedSet[index][0] == index) {
                    preparedSet[preparedSet[index][1]][0] =  preparedSet[index][1];
                }
                else if (preparedSet[index][1] == index) {
                    preparedSet[preparedSet[index][0]][1] =  preparedSet[index][0];
                }
                else {
                    int prevIndexToSwap = preparedSet[index][0];
                    int nextIndexToSwap = preparedSet[index][1];
                    preparedSet[nextIndexToSwap][0] =  prevIndexToSwap;
                    preparedSet[prevIndexToSwap][1] =  nextIndexToSwap;
                }
                givenSet[index] = -1; // Let's assume this is delete action
                result = true;
                break;
            }
            else if (givenSet[index] < x) {
                if (preparedSet[index][1] == index)
                    break;
                else
                    index = preparedSet[index][1];
            }
            else {
                if (preparedSet[index][0] == index)
                    break;
                else
                    index = preparedSet[index][0];
            }
        }

        return result;
    }
}
