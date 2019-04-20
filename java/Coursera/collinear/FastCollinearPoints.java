/* *****************************************************************************
 *  Name:
 *  Date:
 *  Description:
 **************************************************************************** */

import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdOut;

import java.util.Arrays;

public class FastCollinearPoints {
    private LineSegment[] segments;

    // finds all line segments containing 4 or more points
    public FastCollinearPoints(Point[] points) {
        if (points == null)
            throw new IllegalArgumentException("Input param required");
        for (int i = 0; i < points.length; i++) {
            if (points[i] == null)
                throw new IllegalArgumentException("Point cannot be null");
        }

        Point[] pointsCopy = points.clone();
        Arrays.sort(pointsCopy);
        for (int i = 0; i < pointsCopy.length - 1; i++) {
            if (pointsCopy[i].compareTo(pointsCopy[i + 1]) == 0)
                throw new IllegalArgumentException("Duplicate point");
        }
        for (int i = 0; i < pointsCopy.length; i++) {
            Point[] pointsBySlope = pointsCopy.clone();
            Arrays.sort(pointsBySlope, pointsCopy[i].slopeOrder());

            for (int i1 = 0, i2 = 1; i2 < pointsBySlope.length;) {
                double slope1 = pointsCopy[i].slopeTo(pointsBySlope[i1]);
                double slope2 = pointsCopy[i].slopeTo(pointsBySlope[i2]);
                if (Double.compare(slope1, slope2) == 0) {
                    i2++;
                    if (i2 == pointsBySlope.length && i2 - i1 >= 4)
                        addSegment(pointsBySlope[i1], pointsBySlope[i2 - 1]);
                }
                else {
                    if (i2 - i1 >= 3)
                        addSegment(pointsBySlope[i1], pointsBySlope[i2]);
                    i1 = i2;
                    i2++;
                }
            }
            // Last i2 to check
        }
    }

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

    // the number of line segments
    public int numberOfSegments() {
        return segments == null ? 0 : segments.length;
    }

    // the line segments
    public LineSegment[] segments() {
        if (segments == null)
            return new LineSegment[0];

        LineSegment[] copy = new LineSegment[segments.length];
        for (int i = 0; i < segments.length; i++)
            copy[i] = segments[i];
        return copy;
    }

    public static void main(String[] args) {
        // read the n points from a file
        // In in = new In(args[0]);
        In in = new In("input9.txt");
        int n = in.readInt();
        Point[] points = new Point[n];
        for (int i = 0; i < n; i++) {
            int x = in.readInt();
            int y = in.readInt();
            points[i] = new Point(x, y);
        }

        // print and draw the line segments
        FastCollinearPoints collinear = new FastCollinearPoints(points);
        for (LineSegment segment : collinear.segments()) {
            StdOut.println(segment);
        }
        StdOut.println("End");
    }
}
