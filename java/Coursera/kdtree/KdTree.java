/* *****************************************************************************
 *  Name:
 *  Date:
 *  Description:
 **************************************************************************** */

import edu.princeton.cs.algs4.Point2D;
import edu.princeton.cs.algs4.RectHV;
import edu.princeton.cs.algs4.Stack;

public class KdTree {
    private int size;
    private Node root;
    private Node championNode;
    private double championDistance;

    private class Node {
        private final Point2D point;
        private Node leftbottom;
        private Node righttop;
        // private boolean horizontal;

        public Node(Point2D point) {
            this.point = point;
        }
    }

    // construct an empty set of points
    public KdTree() {
        size = 0;
    }

    // is the set empty?
    public boolean isEmpty() {
        return size == 0;
    }

    // number of points in the set
    public int size() {
        return size;
    }

    // add the point to the set (if it is not already in the set)
    public void insert(Point2D p) {
        if (p == null)
            throw new IllegalArgumentException("Point object is empty");

        root = findAndInsert(root, p, false);
    }

    private Node findAndInsert(Node node, Point2D point, boolean horizontal) {
        if (node == null) {
            size++;
            return new Node(point);
        }

        if (!point.equals(node.point)) {
            if (horizontal) {
                if (point.y() < node.point.y()) {
                    node.leftbottom = findAndInsert(node.leftbottom, point, false);
                } else {
                    node.righttop = findAndInsert(node.righttop, point, false);
                }
            } else {
                if (point.x() < node.point.x()) {
                    node.leftbottom = findAndInsert(node.leftbottom, point, true);
                } else {
                    node.righttop = findAndInsert(node.righttop, point, true);
                }
            }
        }
        return node;
    }

    // does the set contain point p?
    public boolean contains(Point2D p) {
        if (p == null)
            throw new IllegalArgumentException("Point object is empty");

        return contains(root, p, false);
    }

    private boolean contains(Node node, Point2D point, boolean horizontal) {
        if (node == null)
            return false;
        else if (node.point.equals(point))
            return true;
        else {
            if (horizontal) {
                if (point.y() < node.point.y())
                    return contains(node.leftbottom, point, false);
                else
                    return contains(node.righttop, point, false);
            } else {
                if (point.x() < node.point.x())
                    return contains(node.leftbottom, point, true);
                else
                    return contains(node.righttop, point, true);
            }
        }
    }

    // draw all points to standard draw
    public void draw() {
        // implement later
    }

    // all points that are inside the rectangle (or on the boundary)
    public Iterable<Point2D> range(RectHV rect) {
        if (rect == null)
            throw new IllegalArgumentException("Rect object is empty");

        Stack<Point2D> ret = new Stack<Point2D>();
        checkRange(root, ret, rect, false);

        return ret;
    }

    private void checkRange(Node node, Stack<Point2D> set, RectHV rect, boolean horizontal) {
        if (node == null)
            return;

        if (rect.contains(node.point))
            set.push(node.point);

        if (horizontal) {
            if (rect.ymin() <= node.point.y())
                checkRange(node.leftbottom, set, rect, false);
            if (rect.ymax() >= node.point.y())
                checkRange(node.righttop, set, rect, false);
        } else {
            if (rect.xmin() <= node.point.x())
                checkRange(node.leftbottom, set, rect, true);
            if (rect.xmax() >= node.point.x())
                checkRange(node.righttop, set, rect, true);
        }
    }

    // a nearest neighbor in the set to point p; null if the set is empty
    public Point2D nearest(Point2D p) {
        if (p == null)
            throw new IllegalArgumentException("Point object is empty");

        if (root == null)
            return null;

        championNode = null;
        championDistance = 0;
        nearest(root, p, false);

        return championNode.point;
    }

    private void nearest(Node node, Point2D p, boolean horizontal) {
        if (node == null)
            return;

        double d = p.distanceSquaredTo(node.point);
        if (d < championDistance || championNode == null) {
            championDistance = d;
            championNode = node;
        }

        if (horizontal) {
            if (p.y() < node.point.y()) {
                nearest(node.leftbottom, p, false);
                if (championNode.point.y() >= node.point.y())
                    nearest(node.righttop, p, false);
            } else {
                nearest(node.righttop, p, false);
                if (championNode.point.y() <= node.point.y())
                    nearest(node.leftbottom, p, false);
            }
        } else {
            if (p.x() < node.point.x()) {
                nearest(node.leftbottom, p, true);
                if (championNode.point.x() >= node.point.x())
                    nearest(node.righttop, p, true);
            } else {
                nearest(node.righttop, p, true);
                if (championNode.point.x() <= node.point.x())
                    nearest(node.leftbottom, p, true);
            }
        }
    }

    public static void main(String[] args) {
        // implement later
    }
}
