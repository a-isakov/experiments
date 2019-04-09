package com.prep;

public class QueueOf2Stacks {
    private class InnerStack {
        private String[] a;
        private int n = 0;

        public boolean isEmpty() {
            return n == 0;
        }

        private void resize(int newSize) {
            String[] copy = new String[newSize];
            for (int i = 0; i < n; i++)
                copy[i] = a[i];
            a = copy;
        }

        public void push(String item) {
            if (isEmpty()) {
                n = 1;
                a = new String[n];
            }
            else if (n == a.length)
                resize(2 * a.length);
            a[n++] = item;
        }

        public String pop() {
            String item = a[--n];
            a[n] = null;
            if (n > 0 && n == a.length/4)
                resize(a.length/2);
            return item;
        }
    }

    private int n = 0;
    private int lastAction = 0; // 0 - enqueue, 1 - dequeue
    private InnerStack s1, s2;

    public QueueOf2Stacks() {
        s1 = new InnerStack();
        s2 = new InnerStack();
    }

    public void enqueue(String item) {
        if (lastAction == 1) {
            while (!s2.isEmpty()) {
                String x = s2.pop();
                s1.push(x);
            }
        }
        s1.push(item);
        n++;
        lastAction = 0;
    }

    public String dequeue() {
        if (lastAction == 0) {
            while (!s1.isEmpty()) {
                String item = s1.pop();
                s2.push(item);
            }
        }
        n--;
        lastAction = 1;
        return s2.pop();
    }

    boolean isEmpty() {
        return n == 0;
    }

    int size() {
        return n;
    }
}
