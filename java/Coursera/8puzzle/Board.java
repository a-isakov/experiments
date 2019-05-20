public class Board {
    private int[][] board;

    // construct a board from an n-by-n array of blocks
    // (where blocks[i][j] = block in row i, column j)
    public Board(int[][] blocks) {
        board = new int[blocks.length][blocks[0].length];
        for (int i = 0; i < blocks.length; i++) {
            for (int j = 0; j < blocks[i].length; j++) {
                board[i][j] = blocks[i][j];
            }
        }
    }

    // board dimension n
    public int dimension() {
        return board.length;
    }

    // number of blocks out of place
    public int hamming() {
        int h = 0;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                int index = j*board.length + i;
                if (board[i][j] == index)
                    h++;
            }
        }
        return h;
    }

    // sum of Manhattan distances between blocks and goal
    public int manhattan() {
        int m = 0;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                int index = j*board.length + i;
                int x = index % board.length;
                int y = index/board.length;
                m += Math.abs(x - i) + Math.abs(y - j);
            }
        }
        return m;
    }

    // is this board the goal board?
    public boolean isGoal() {
        int index = 1;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] != index)
                    return false;
                index++;
            }
        }
        return true;
    }

    // a board that is obtained by exchanging any pair of blocks
    public Board twin() {
        // TODO:
        return null;
    }

    // does this board equal y?
    public boolean equals(Object y) {
        // TODO:
        return false;
    }

    // all neighboring boards
    public Iterable<Board> neighbors() {
        // TODO:
        return null;
    }

    // string representation of this board (in the output format specified below)
    public String toString() {
        // TODO:
        return "";
    }

    public static void main(String[] args) {
        // int n = 3 - 1;
        // int x = n%3;
        // int y = n/3;
        // n = 0;
    }
}
