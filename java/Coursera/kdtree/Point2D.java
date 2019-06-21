
import edu.princeton.cs.algs4.StdDraw;

public class Point2D implements Comparable<Point2D> {
    private double x;
    private double y;
    public double x() { return x; }
    public double y() { return y; }

    // construct the point (x, y)
    public Point2D(double x, double y) {
        if (x < 0 || x > 1 || y < 0 || y > 1)
            throw new java.lang.IllegalArgumentException();

        this.x = x;
        this.y = y;
    }

    // Euclidean distance between two points
    public double distanceTo(Point2D that) {
        if (that == null)
            throw new java.lang.IllegalArgumentException();
        return Math.sqrt(distanceSquaredTo(that));
    }

    // square of Euclidean distance between two points
    public double distanceSquaredTo(Point2D that) {
        if (that == null)
            throw new java.lang.IllegalArgumentException();
        return (that.x - x)*(that.x - x) + (that.y - y)*(that.y - y);
    }

    // for use in an ordered symbol table
    public int compareTo(Point2D that) {
        if (that.x < x)
            return -1;
        if (that.x > x)
            return 1;
        return 0;
    }

    // does this point equal that object?
    public boolean equals(Object that) {
        if (that == this) return true;
        if (that == null) return false;
        if (that.getClass() != this.getClass()) return false;
        Point2D thatPoint = (Point2D) that;
        return x == thatPoint.x && y == thatPoint.y;
    }

    // draw to standard draw
    public void draw() {
        StdDraw.point(x, y);
    }

    // string representation
    public String toString() {
        return "x = " + Double.toString(x) + ", y = " + Double.toString(y);
    }
}