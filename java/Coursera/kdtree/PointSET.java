/* *****************************************************************************
 *  Name:
 *  Date:
 *  Description:
 **************************************************************************** */

import edu.princeton.cs.algs4.Point2D;
import edu.princeton.cs.algs4.RectHV;
import edu.princeton.cs.algs4.SET;
import edu.princeton.cs.algs4.Stack;
import edu.princeton.cs.algs4.StdOut;
import edu.princeton.cs.algs4.StdRandom;

public class PointSET {
    private final SET<Point2D> points;

    // construct an empty set of points
    public PointSET() {
        points = new SET<Point2D>();
    }

    // is the set empty?
    public boolean isEmpty() {
        return points.isEmpty();
    }

    // number of points in the set
    public int size() {
        return points.size();
    }

    // add the point to the set (if it is not already in the set)
    public void insert(Point2D p) {
        if (p == null)
            throw new IllegalArgumentException("Point object is empty");

        if (!points.contains(p))
            points.add(p);
    }

    // does the set contain point p?
    public boolean contains(Point2D p) {
        if (p == null)
            throw new IllegalArgumentException("Point object is empty");

        return points.contains(p);
    }

    // draw all points to standard draw
    public void draw() {
        for (Point2D point: points) {
            point.draw();
        }
    }

    // all points that are inside the rectangle (or on the boundary)
    public Iterable<Point2D> range(RectHV rect) {
        if (rect == null)
            throw new IllegalArgumentException("Rect object is empty");

        Stack<Point2D> ret = new Stack<Point2D>();
        for (Point2D point: points) {
            if (rect.contains(point)) {
                ret.push(point);
            }
        }

        return ret;
    }

    // a nearest neighbor in the set to point p; null if the set is empty
    public Point2D nearest(Point2D p) {
        if (p == null)
            throw new IllegalArgumentException("Point object is empty");

        Point2D np = null;
        double nd = 0;
        for (Point2D point: points) {
            double distance = p.distanceSquaredTo(point);
            if (distance <= nd || np == null) {
                nd = distance;
                np = point;
            }
        }

        return np;
    }

    public static void main(String[] args) {
        PointSET ps = new PointSET();
        for (int i = 0; i < 10; i++) {
            double x = StdRandom.uniform(0.0, 1.0);
            double y = StdRandom.uniform(0.0, 1.0);
            StdOut.printf("%8.6f %8.6f\n", x, y);
            ps.insert(new Point2D(x, y));
        }
        // ps = null;
    }
}
