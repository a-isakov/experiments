/* *****************************************************************************
 *  Name:
 *  Date:
 *  Description:
 **************************************************************************** */

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

        Point[] pointsCopy = new Point[points.length];
        for (int i = 0; i < points.length; i++) {
            pointsCopy[i] = points[i];
        }
        Arrays.sort(pointsCopy);
        for (int i = 0; i < pointsCopy.length - 1; i++) {
            if (pointsCopy[i].compareTo(pointsCopy[i + 1]) == 0)
                throw new IllegalArgumentException("Duplicate point");
        }
        for (int i0 = 0; i0 < pointsCopy.length - 3; i0++) {
            for (int i1 = i0 + 1; i1 < pointsCopy.length - 2; i1++) {
                for (int i2 = i1 + 1; i2 < pointsCopy.length - 1; i2++) {
                    for (int i3 = i2 + 1; i3 < pointsCopy.length; i3++) {
                        double slope01 = pointsCopy[i0].slopeTo(pointsCopy[i1]);
                        double slope02 = pointsCopy[i0].slopeTo(pointsCopy[i2]);
                        double slope03 = pointsCopy[i0].slopeTo(pointsCopy[i3]);

                        boolean collinear = (Double.compare(slope01, slope02) == 0 && Double.compare(slope02, slope03) == 0);
                        if (collinear) {
                            addSegment(pointsCopy[i0], pointsCopy[i3]);
                        }
                    }
                }
            }
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
}
