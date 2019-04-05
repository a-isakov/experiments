/* *****************************************************************************
 *  Name:
 *  Date:
 *  Description:
 **************************************************************************** */

import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdStats;
import edu.princeton.cs.algs4.Stopwatch;

public class PercolationStats {
    private static final double CONFIDENCE_95 = 1.96;

    private final double mean;
    private final double stddev;
    private final double confidenceLo;
    private final double confidenceHi;

    // perform trials independent experiments on an n-by-n grid
    public PercolationStats(int n, int trials) {
        if (n <= 0)
            throw new IllegalArgumentException("size should be positive");
        if (trials <= 0)
            throw new IllegalArgumentException("trials should be positive");

        double[] results = new double[trials];
        for (int i = 0; i < trials; i++) {
            Percolation perc = new Percolation(n);
            while (!perc.percolates()) {
                int row = StdRandom.uniform(1, n + 1);
                int col = StdRandom.uniform(1, n + 1);

                perc.open(row, col);
            }
            results[i] = (double) perc.numberOfOpenSites()/(double) (n*n);
        }

        mean = StdStats.mean(results);
        stddev = StdStats.stddev(results);
        confidenceLo = mean - (CONFIDENCE_95*stddev)/Math.sqrt(trials);
        confidenceHi = mean + (CONFIDENCE_95*stddev)/Math.sqrt(trials);
    }

    // sample mean of percolation threshold
    public double mean() {
        return mean;
    }

    // sample standard deviation of percolation threshold
    public double stddev() {
        return stddev;
    }

    // low  endpoint of 95% confidence interval
    public double confidenceLo() {
        return confidenceLo;
    }

    // high endpoint of 95% confidence interval
    public double confidenceHi() {
        return confidenceHi;
    }

    public static void main(String[] args) {
        // if (args.length == 0 || args.length > 2)
        //     throw new IllegalArgumentException("there should be 2 arguments");
        //
        // int n = Integer.parseInt(args[0]);
        // int trials = Integer.parseInt(args[1]);
        Stopwatch timer = new Stopwatch();
        int n = Integer.parseInt("200");
        int trials = Integer.parseInt("100");
        PercolationStats s = new PercolationStats(n, trials);
        System.out.printf("mean\t\t\t\t\t= %f\n", s.mean());
        System.out.printf("stddev\t\t\t\t\t= %f\n", s.stddev());
        System.out.printf("95%% confidence interval\t= [%f, %f]\n", s.confidenceLo(), s.confidenceHi());
        System.out.printf("Elapsed: %f", timer.elapsedTime());
    }
}
