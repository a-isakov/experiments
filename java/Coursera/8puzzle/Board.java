public class Board {
    private int[][] board;

    // construct a board from an n-by-n array of blocks
    // (where blocks[i][j] = block in row i, column j)
    public Board(int[][] blocks) {
        if (blocks == null)
            throw new IllegalArgumentException("Null argument");

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
                int index = i*board.length + j + 1;
                if (board[i][j] != index && board[i][j] != 0)
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
                if (board[i][j] == 0)
                    continue;
                int index = i*board.length + j + 1;
                int x = index % board.length;
                int y = index/board.length;
                m += Math.abs(x - j) + Math.abs(y - i);
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
        // Most probably it is incorrect
        if (board[0][0] == 0) {
            int value = board[0][1];
            board[0][1] = board[0][2];
            board[0][2] = value;
        } else if (board[0][1] == 0) {
            int value = board[0][0];
            board[0][0] = board[0][2];
            board[0][2] = value;
        } else {
            int value = board[0][0];
            board[0][0] = board[0][1];
            board[0][1] = value;
        }
        return null;
    }

    // does this board equal y?
    public boolean equals(Object y) {
        if (y == this) return true;
        if (y == null) return false;
        if (y.getClass() != this.getClass()) return false;

        int[][] anotherBoard = (int[][]) y;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] != anotherBoard[i][j])
                    return false;
            }
        }
        return true;
    }

    // all neighboring boards
    public Iterable<Board> neighbors() {
        // TODO:
        return null;
    }

    // string representation of this board (in the output format specified below)
    public String toString() {
        StringBuilder s = new StringBuilder();
        s.append(board.length + "\n");
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board.length; j++) {
                s.append(String.format("%2d ", board[i][j]));
            }
            s.append("\n");
        }
        return s.toString();
    }

    public static void main(String[] args) {
        // int n = 3 - 1;
        // int x = n%3;
        // int y = n/3;
        // n = 0;
    }
}
