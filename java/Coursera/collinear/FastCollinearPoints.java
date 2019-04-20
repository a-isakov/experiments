/* *****************************************************************************
 *  Name:
 *  Date:
 *  Description:
 **************************************************************************** */

import edu.princeton.cs.algs4.In;
import edu.princeton.cs.algs4.StdOut;

import java.util.ArrayList;
import java.util.Arrays;

public class FastCollinearPoints {
    private ArrayList<LineSegment> segments = new ArrayList<>();

    // finds all line segments containing 4 or more points
    public FastCollinearPoints(Point[] points) {
        if (points == null)
            throw new IllegalArgumentException("Input param required");
        for (int i = 0; i < points.length; i++) {
            if (points[i] == null)
                throw new IllegalArgumentException("Point cannot be null");
        }

        Point[] aux = Arrays.copyOf(points, points.length);
        for (int i = 0; i < points.length; i++) {
            Point p = points[i];
            Arrays.sort(aux);
            Arrays.sort(aux, p.slopeOrder());

            int minIndex = 0;
            while (minIndex < aux.length && p.slopeTo(aux[minIndex]) == Double.NEGATIVE_INFINITY)
                minIndex++;
            if (minIndex != 1)
                throw new IllegalArgumentException("Duplicate point");
            int maxIndex = minIndex;
            while (minIndex < aux.length) {
                while (maxIndex < aux.length && p.slopeTo(aux[maxIndex]) == p.slopeTo(aux[minIndex]))
                    maxIndex++;
                if (maxIndex - minIndex >= 3) {
                    Point pMin = aux[minIndex].compareTo(p) < 0 ? aux[minIndex] : p;
                    Point pMax = aux[maxIndex - 1].compareTo(p) > 0 ? aux[maxIndex - 1] : p;
                    if (p.equals(pMin))
                        segments.add(new LineSegment(pMin, pMax));
                }
                minIndex = maxIndex;
            }
        }
    }

    // the number of line segments
    public int numberOfSegments() {
        return segments.size();
    }

    // the line segments
    public LineSegment[] segments() {
        LineSegment[] segmentsCopy = new LineSegment[segments.size()];
        return segments.toArray(segmentsCopy);
    }

    public static void main(String[] args) {
        // read the n points from a file
        In in = new In(args[0]);
        // In in = new In("input9.txt");
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
