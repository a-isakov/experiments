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
            return thisScore == thatScore ? that.step - step : thisScore - thatScore;
        }
    }

    // find a solution to the initial board (using the A* algorithm)
    public Solver(Board initial) {
        if (initial == null)
            throw new java.lang.IllegalArgumentException();

        Board twin = initial.twin();

        MinPQ<SolutionNode> pqInit = new MinPQ<>();
        MinPQ<SolutionNode> pqTwin = new MinPQ<>();

        SolutionNode searchNodeInit = new SolutionNode(initial, 0, null);
        SolutionNode searchNodeTwin = new SolutionNode(twin, 0, null);

        // int step = 0;
        while (!searchNodeInit.board.isGoal() && !searchNodeTwin.board.isGoal()) {
            // step++;

            Iterable<Board> neighborsInit = searchNodeInit.board.neighbors();
            Iterable<Board> neighborsTwin = searchNodeTwin.board.neighbors();

            SolutionNode checkNode = searchNodeInit.prev;
            for (Board neighbor: neighborsInit) {
                if (checkNode == null || !checkNode.board.equals(neighbor))
                    pqInit.insert(new SolutionNode(neighbor, searchNodeInit.step + 1, searchNodeInit));
            }
            checkNode = searchNodeTwin.prev;
            for (Board neighbor: neighborsTwin) {
                if (checkNode == null || !checkNode.board.equals(neighbor))
                    pqTwin.insert(new SolutionNode(neighbor, searchNodeInit.step + 1, searchNodeTwin));
            }

            searchNodeInit = pqInit.delMin();
            searchNodeTwin = pqTwin.delMin();
        }

        if (searchNodeInit.board.isGoal()) {
            solvable = true;
            counter = searchNodeInit.step;
            solution = new Stack<>();
            while (searchNodeInit != null) {
                solution.push(searchNodeInit.board);
                searchNodeInit = searchNodeInit.prev;
            }
        } else {
            // solution = solTwin;
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
