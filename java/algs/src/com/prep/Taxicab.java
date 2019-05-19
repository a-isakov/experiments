package com.prep;

public class Taxicab {

    public class Keeper {
        private int a;
        private int b;
        private int qSum;

        private Keeper(int a, int b, int qSum) {
            this.a = a;
            this.b = b;
            this.qSum = qSum;
        }

        public int getA() {
            return a;
        }

        public int getB() {
            return b;
        }

        public int getQSum() {
            return qSum;
        }
    }

    public Taxicab() {
        int n = 20;

        // Returns Keeper object if the same qSum already in place
        PQwithException pq = new PQwithException();

        for (int a = 1; a <= n; a++) {
            for (int b = a; b <= n; b++) {
                int qSum = a*a*a + b*b*b;
                Keeper item = new Keeper(a, b, qSum);
                Keeper copy = pq.insert(item);
                if (copy != null && item.getA() != copy.getA() && item.getA() != copy.getB())
                    return (item.getA(), item.getB(), copy.getA(), copy.getB());
            }
        }
    }
}
