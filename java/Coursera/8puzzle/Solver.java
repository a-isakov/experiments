import edu.princeton.cs.algs4.MinPQ;
import edu.princeton.cs.algs4.Stack;

public class Solver {
    private Stack<Board> solution;
    private boolean solvable;
    private int counter = -1;

    private class SolutionNode implements Comparable<SolutionNode> {
        private final int step;
        private final int manhattan;
        private final Board board;
        private final SolutionNode prev;

        public SolutionNode(Board board, int step, SolutionNode prev) {
            this.step = step;
            this.board = board;
            this.manhattan = board.manhattan();
            this.prev = prev;
        }

        public int compareTo(SolutionNode that) {
            final int thisScore = manhattan + step;
            final int thatScore = that.board.manhattan() + that.step;
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

        SolutionNode searchNodeInit = new SolutionNode(initial, 0, null);
        SolutionNode searchNodeTwin = new SolutionNode(twin, 0, null);

        pqInit.insert(searchNodeInit);
        pqTwin.insert(searchNodeTwin);

        searchNodeInit = pqInit.delMin();
        searchNodeTwin = pqTwin.delMin();

        int step = 0;
        while (!searchNodeInit.board.isGoal() && !searchNodeTwin.board.isGoal()) {
            step++;

            Iterable<Board> neighborsInit = searchNodeInit.board.neighbors();
            Iterable<Board> neighborsTwin = searchNodeTwin.board.neighbors();
            for (Board neighbor: neighborsInit) {
                SolutionNode checkNode = searchNodeInit.prev;
                boolean historyDetected = false;
                while (checkNode != null) {
                    if (neighbor.equals(checkNode.board)) {
                        historyDetected = true;
                        break;
                    }
                    checkNode = checkNode.prev;
                }
                if (!historyDetected)
                    pqInit.insert(new SolutionNode(neighbor, step, searchNodeInit));
            }
            for (Board neighbor: neighborsTwin) {
                SolutionNode checkNode = searchNodeTwin.prev;
                boolean historyDetected = false;
                while (checkNode != null) {
                    if (neighbor.equals(checkNode.board)) {
                        historyDetected = true;
                        break;
                    }
                    checkNode = checkNode.prev;
                }
                if (!historyDetected)
                    pqTwin.insert(new SolutionNode(neighbor, step, searchNodeTwin));
            }

            searchNodeInit = pqInit.delMin();
            searchNodeTwin = pqTwin.delMin();

            solInit.push(searchNodeInit.board);
            solTwin.push(searchNodeTwin.board);
        }

        if (searchNodeInit.board.isGoal()) {
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
