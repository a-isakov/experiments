import edu.princeton.cs.algs4.MinPQ;
import edu.princeton.cs.algs4.Stack;

public class Solver {
    private Stack<Board> solution;
    private boolean solvable;
    private int counter = -1;

    private class SolutionNode implements Comparable<SolutionNode> {
        private final int step;
        private final Board board;

        public SolutionNode(Board board, int step) {
            this.step = step;
            this.board = board;
        }

        public int compareTo(SolutionNode that) {
            final int thisScore = board.manhattan() + step;
            final int thatScore = that.board.manhattan() + step;
            return thisScore - thatScore;
        }
    }

    // find a solution to the initial board (using the A* algorithm)
    public Solver(Board initial) {
        if (initial == null)
            throw new java.lang.IllegalArgumentException();

        Board twin = initial.twin();

        Stack<Board> solInit = new Stack<>();
        Stack<Board> solTwin = new Stack<>();

        MinPQ<SolutionNode> pqInit = new MinPQ<>();
        MinPQ<SolutionNode> pqTwin = new MinPQ<>();

        pqInit.insert(new SolutionNode(initial, 0));
        pqTwin.insert(new SolutionNode(twin, 0));

        Board prevInit = null;
        Board prevTwin = null;

        Board searchInit = pqInit.delMin().board;
        Board searchTwin = pqTwin.delMin().board;

        int step = 0;
        while (!searchInit.isGoal() && !searchTwin.isGoal()) {
            Stack<Board> neighborsInit = (Stack<Board>) searchInit.neighbors();
            Stack<Board> neighborsTwin = (Stack<Board>) searchTwin.neighbors();
            for (Board neighbor: neighborsInit) {
                if (!neighbor.equals(prevInit))
                    pqInit.insert(new SolutionNode(neighbor, step));
            }
            for (Board neighbor: neighborsTwin) {
                if (!neighbor.equals(prevTwin))
                    pqTwin.insert(new SolutionNode(neighbor, step));
            }
            prevInit = searchInit;
            prevTwin = searchTwin;

            searchInit = pqInit.delMin().board;
            searchTwin = pqTwin.delMin().board;

            solInit.push(searchInit);
            solTwin.push(searchTwin);

            step++;
        }

        if (searchInit.isGoal()) {
            solution = solInit;
            solvable = true;
            counter = step;
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
        return counter;
    }

    // sequence of boards in a shortest solution; null if unsolvable
    public Iterable<Board> solution() {
        return solution;
    }

    public static void main(String[] args) {
        // nothing here
    }
}
