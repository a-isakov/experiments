/******************************************************************************
 *  Compilation:  javac KdTreeGenerator.java
 *  Execution:    java KdTreeGenerator n
 *  Dependencies: 
 *
 *  Creates n random points in the unit square and print to standard output.
 *
 *  % java KdTreeGenerator 5
 *  0.195080 0.938777
 *  0.351415 0.017802
 *  0.556719 0.841373
 *  0.183384 0.636701
 *  0.649952 0.237188
 *
 ******************************************************************************/

import edu.princeton.cs.algs4.Point2D;
import edu.princeton.cs.algs4.RectHV;
import edu.princeton.cs.algs4.StdRandom;
import edu.princeton.cs.algs4.StdOut;

public class KdTreeGenerator {

    public static void main(String[] args) {
        // int n = Integer.parseInt(args[0]);
        PointSET set1 = new PointSET();
        KdTree set2 = new KdTree();
        for (int i = 0; i < 10; i++) {
            double x = StdRandom.uniform(0.0, 1.0);
            double y = StdRandom.uniform(0.0, 1.0);
            StdOut.printf("%8.6f %8.6f\n", x, y);
            Point2D point = new Point2D(x, y);
            set1.insert(point);
            set2.insert(point);
        }

        RectHV rect = new RectHV(0, 0, 1, 1);
        for (Point2D point: set1.range(rect)) {
            if (set2.contains(point))
                StdOut.printf("%8.6f %8.6f passed\n", point.x(), point.y());
            else
                StdOut.printf("%8.6f %8.6f FAILED\n", point.x(), point.y());
        }

        RectHV rect2 = new RectHV(0.2, 0.2, 0.7, 0.7);
        Iterable<Point2D> ret1 = set1.range(rect2);
        Iterable<Point2D> ret2 = set2.range(rect2);

        for (int i = 0; i < 10; i++) {
            double x = StdRandom.uniform(0.0, 1.0);
            double y = StdRandom.uniform(0.0, 1.0);

            Point2D p = new Point2D(x, y);
            Point2D p1 = set1.nearest(p);
            Point2D p2 = set2.nearest(p);
            if (p1.equals(p2))
                StdOut.printf("%8.6f %8.6f passed\n", p.x(), p.y());
            else
                StdOut.printf("%8.6f %8.6f FAILED\n", p.x(), p.y());
        }

        ret2 = null;
    }
}
