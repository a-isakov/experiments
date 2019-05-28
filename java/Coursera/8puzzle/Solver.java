import edu.princeton.cs.algs4.MinPQ;
import edu.princeton.cs.algs4.Stack;

public class Solver {
    MinPQ<Board> pq;

    // find a solution to the initial board (using the A* algorithm)
    public Solver(Board initial) {
        pq = new MinPQ<>();
        pq.insert(initial);
        Board b = null;
        while (b == null || !b.isGoal()) {
            b = pq.delMin();
            Stack<Board> neighbors = (Stack<Board>) b.neighbors();
            while (!neighbors.isEmpty()) {
                Board neighbor = neighbors.pop();
                pq.insert(neighbor);
            }
        }
    }

    // is the initial board solvable?
    public boolean isSolvable() {
        // TODO:
        return false;
    }

    // min number of moves to solve initial board; -1 if unsolvable
    public int moves() {
        // TODO:
        return 0;
    }

    // sequence of boards in a shortest solution; null if unsolvable
    public Iterable<Board> solution() {
        // TODO:
        return null;
    }

    public static void main(String[] args) {

    }
}
