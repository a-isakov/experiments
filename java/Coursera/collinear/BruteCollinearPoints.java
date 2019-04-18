/*
Write a program BruteCollinearPoints.java that examines 4 points at a time and checks whether they
all lie on the same line segment, returning all such line segments. To check whether the 4 points
p, q, r, and s are collinear, check whether the three slopes between p and q, between p and r,
and between p and s are all equal.
*/

import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdDraw;
import edu.princeton.cs.algs4.StdOut;

import java.util.Arrays;

public class BruteCollinearPoints {
    private LineSegment[] segments;

    private void addSegment(final Point point1, final Point point2) {
        if (segments == null) {
            segments = new LineSegment[1];
        }
        else {
            LineSegment[] newArray = new LineSegment[segments.length + 1];
            for (int i = 0; i < segments.length; i++) {
                newArray[i] = segments[i];
            }
            segments = newArray;
        }

        segments[segments.length - 1] = new LineSegment(point1, point2);
    }

    // finds all line segments containing 4 points
    public BruteCollinearPoints(Point[] points) {
        if (points == null)
            throw new IllegalArgumentException("Input param required");
        for (int i = 0; i < points.length; i++) {
            if (points[i] == null)
                throw new IllegalArgumentException("Point cannot be null");
        }

        Arrays.sort(points);
        for (int i0 = 0; i0 < points.length - 3; i0++) {
            for (int i1 = i0 + 1; i1 < points.length - 2; i1++) {
                for (int i2 = i1 + 1; i2 < points.length - 1; i2++) {
                    for (int i3 = i2 + 1; i3 < points.length; i3++) {
                        double slope01 = points[i0].slopeTo(points[i1]);
                        double slope02 = points[i0].slopeTo(points[i2]);
                        double slope03 = points[i0].slopeTo(points[i3]);
                        boolean collinear = (slope01 == slope02 && slope02 == slope03);
                        if (collinear) {
                            addSegment(points[i0], points[i3]);
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
        BruteCollinearPoints collinear = new BruteCollinearPoints(points);
        for (LineSegment segment : collinear.segments()) {
            StdOut.println(segment);
            segment.draw();
        }
        StdDraw.show();
    }
}
