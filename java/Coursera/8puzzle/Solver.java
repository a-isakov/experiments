import edu.princeton.cs.algs4.MinPQ;
import edu.princeton.cs.algs4.Stack;

public class Solver {
    private Stack<Board> solution = null;
    private boolean solvable = false;
    private int moves = -1;

    // find a solution to the initial board (using the A* algorithm)
    public Solver(Board initial) {
        if (initial == null)
            throw new java.lang.IllegalArgumentException();

        Board twin = initial.twin();

        Stack<Board> solInit = new Stack<>();
        Stack<Board> solTwin = new Stack<>();

        MinPQ<Board> pqInit = new MinPQ<>();
        MinPQ<Board> pqTwin = new MinPQ<>();

        pqInit.insert(initial);
        pqTwin.insert(twin);

        Board prevInit = null;
        Board prevTwin = null;

        Board searchInit = pqInit.delMin();
        Board searchTwin = pqTwin.delMin();

        int i = 0;
        while (!searchInit.isGoal() && !searchTwin.isGoal()) {
            Stack<Board> neighborsInit = (Stack<Board>) searchInit.neighbors();
            Stack<Board> neighborsTwin = (Stack<Board>) searchTwin.neighbors();
            for (Board neighbor: neighborsInit) {
                if (!neighbor.equals(prevInit))
                    pqInit.insert(neighbor);
            }
            for (Board neighbor: neighborsTwin) {
                if (!neighbor.equals(prevTwin))
                    pqTwin.insert(neighbor);
            }
            prevInit = searchInit;
            prevTwin = searchTwin;

            searchInit = pqInit.delMin();
            searchTwin = pqTwin.delMin();

            solInit.push(searchInit);
            solTwin.push(searchTwin);

            i++;
        }
        moves = i;

        if (searchInit.isGoal()) {
            solution = solInit;
            solvable = true;
        } else {
            solution = solTwin;
            solvable = false;
        }
    }

    // is the initial board solvable?
    public boolean isSolvable() {
        return solvable;
    }

    // min number of moves to solve initial board; -1 if unsolvable
    public int moves() {
        return moves;
    }

    // sequence of boards in a shortest solution; null if unsolvable
    public Iterable<Board> solution() {
        return solution;
    }

    public static void main(String[] args) {

    }
}
