package com.prep;

public class StackWithMax {
    private Node first = null;
    private class Node {
        int item;
        Node next;
    }

    public boolean isEmpty() {
        return first == null;
    }

    public void push(int item) {
        Node oldFirst = first;
        first = new Node();
        first.item = item;
        first.next = oldFirst;
    }

    public int pop() {
        int item = first.item;
        first = first.next;
        return item;
    }

    public int returnTheMaximum() {
        if (first == null)
            throw new IllegalArgumentException("It's empty yet");

        Node maxNode = null;
        Node maxNodePrev = null;
        Node i = first;
        Node iPrev = null;
        int maxValue = Integer.MIN_VALUE;
        while (i != null) {
            if (i.item > maxValue) {
                maxValue = i.item;
                maxNode = i;
                maxNodePrev = iPrev;
            }

            iPrev = i;
            i = i.next;
        }

        if (maxNodePrev == null) {
            first = maxNode.next;
        }
        else {
            maxNodePrev.next = maxNode.next;
        }
        maxNode = null;
        return maxValue;
    }
}
