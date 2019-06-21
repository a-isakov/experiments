
import edu.princeton.cs.algs4.StdDraw;

public class RectHV {
    private double xmin;
    private double xmax;
    private double ymin;
    private double ymax;

    // construct the rectangle [xmin, xmax] x [ymin, ymax]
    // throw a java.lang.IllegalArgumentException if (xmin > xmax) or (ymin > ymax)
    public RectHV(double xmin, double ymin, double xmax, double ymax) {
        if (xmin < 0 || xmin > 1 || xmax < 0 || xmax > 1 || xmin > xmax)
            throw new java.lang.IllegalArgumentException();
        if (ymin < 0 || ymin > 1 || ymax < 0 || ymax > 1 || ymin > ymax)
            throw new java.lang.IllegalArgumentException();

        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }

    // minimum x-coordinate of rectangle
    public double xmin() {
        return xmin;
    }

    // minimum y-coordinate of rectangle
    public double ymin() {
        return ymin;
    }

    // maximum x-coordinate of rectangle
    public double xmax() {
        return xmax;
    }

    // maximum y-coordinate of rectangle
    public double ymax() {
        return ymax;
    }

    // does this rectangle contain the point p (either inside or on boundary)?
    public boolean contains(Point2D p) {
        if (p == null)
            throw new java.lang.IllegalArgumentException();
        return p.x() >= xmin && p.x() <= xmax && p.y() >= ymin && p.y() <= ymax;
    }

    // does this rectangle intersect that rectangle (at one or more points)?
    public boolean intersects(RectHV that) {
        if (that == null)
            throw new java.lang.IllegalArgumentException();
        return xmax <= that.xmin() && xmin <= that.xmax() && ymax <= that.ymin() && ymin <= that.ymax();
    }

    // Euclidean distance from point p to closest point in rectangle
    public double distanceTo(Point2D p) {
        if (p == null)
            throw new java.lang.IllegalArgumentException();
        return Math.sqrt(distanceSquaredTo(p));
    }

    // square of Euclidean distance from point p to closest point in rectangle
    public double distanceSquaredTo(Point2D p) {
        if (p == null)
            throw new java.lang.IllegalArgumentException();
        double dx = 0.0;
        double dy = 0.0;
        if (p.x() < xmin)
            dx = xmin - p.x();
        else if (p.x() > xmax)
            dx = p.x() - xmax;
        if (p.y() < ymin)
            dy = ymin - p.y();
        else if (p.y() > ymax)
            dy = p.y() - ymax;
        return dx*dx + dy*dy;
    }

    // does this rectangle equal that object?
    public boolean equals(Object that) {
        if (that == this) return true;
        if (that == null) return false;
        if (that.getClass() != this.getClass()) return false;
        RectHV thatPoint = (RectHV) that;
        return xmin == thatPoint.xmin && xmax == thatPoint.xmax && ymin == thatPoint.ymin && ymax == thatPoint.ymax;
    }

    // draw to standard draw
    public void draw() {
        StdDraw.line(xmin, ymin, xmax, ymin);
        StdDraw.line(xmax, ymin, xmax, ymax);
        StdDraw.line(xmax, ymax, xmin, ymax);
        StdDraw.line(xmin, ymax, xmin, ymin);
    }

    // string representation
    public String toString() {
        return "xmin = " + Double.toString(xmin) + ", xmax = " + Double.toString(xmax) + ", ymin = " + Double.toString(ymin) + ", ymax = " + Double.toString(ymax);
    }
}
