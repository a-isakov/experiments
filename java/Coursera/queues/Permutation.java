import edu.princeton.cs.algs4.StdOut;

public class Permutation {
    public static void main(String[] args) {
        if (args.length > 0) {
            final int k = Integer.parseInt(args[0]);
            RandomizedQueue<String> rq = new RandomizedQueue<>();
            for (int i = 1; i < args.length; i++) {
                rq.enqueue(args[i]);
            }
            int i = 0;
            for (String s : rq) {
                StdOut.println(s);
                i++;
                if (i == k)
                    break;
            }
        }
    }
}
