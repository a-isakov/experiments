/*
Write a program BruteCollinearPoints.java that examines 4 points at a time and checks whether they
all lie on the same line segment, returning all such line segments. To check whether the 4 points
p, q, r, and s are collinear, check whether the three slopes between p and q, between p and r,
and between p and s are all equal.
*/

import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdDraw;

public class BruteCollinearPoints {
    private LineSegment[] segments;

    // finds all line segments containing 4 points
    public BruteCollinearPoints(Point[] points) {
        if (points == null)
            throw new IllegalArgumentException("Input param required");
        // if (points.length != 4)
        //     throw new IllegalArgumentException("Number of points should be 4");

        boolean found = false;
        for (int i0 = 0; i0 < points.length - 3 && !found; i0++) {
            if (points[i0] == null)
                throw new IllegalArgumentException("Point cannot be null");

            for (int i1 = i0 + 1; i1 < points.length - 2 && !found; i1++) {
                if (points[i1] == null)
                    throw new IllegalArgumentException("Point cannot be null");

                for (int i2 = i1 + 1; i2 < points.length - 1 && !found; i2++) {
                    if (points[i2] == null)
                        throw new IllegalArgumentException("Point cannot be null");

                    for (int i3 = i2 + 1; i3 < points.length && !found; i3++) {
                        if (points[i3] == null)
                            throw new IllegalArgumentException("Point cannot be null");

                        double slope01 = points[i0].slopeTo(points[i1]);
                        double slope02 = points[i0].slopeTo(points[i2]);
                        double slope03 = points[i0].slopeTo(points[i3]);
                        boolean collinear = (slope01 == slope02 && slope02 == slope03);
                        if (collinear) {
                            segments = new LineSegment[3];
                            segments[0] = new LineSegment(points[i0], points[i1]);
                            segments[1] = new LineSegment(points[i1], points[i2]);
                            segments[2] = new LineSegment(points[i2], points[i3]);
                            found = true;
                        }
                    }
                }
            }
         }
    }

    // the number of line segments
    public int numberOfSegments() {
        return segments == null ? 0 : 3;
    }

    // the line segments
    public LineSegment[] segments() {
        return segments;
    }

    public static void main(String[] args) {
        // read the n points from a file
        //In in = new In(args[0]);
        In in = new In("input8.txt");
        int n = in.readInt();
        Point[] points = new Point[n];
        for (int i = 0; i < n; i++) {
            int x = in.readInt();
            int y = in.readInt();
            points[i] = new Point(x, y);
        }

        // draw the points
        StdDraw.enableDoubleBuffering();
        StdDraw.setXscale(0, 32768);
        StdDraw.setYscale(0, 32768);
        for (Point p : points) {
            p.draw();
        }
        StdDraw.show();

        // print and draw the line segments
        // FastCollinearPoints collinear = new FastCollinearPoints(points);
        // for (LineSegment segment : collinear.segments()) {
        //     StdOut.println(segment);
        //     segment.draw();
        // }
        // StdDraw.show();
    }
}
