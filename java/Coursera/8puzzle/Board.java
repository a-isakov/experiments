import edu.princeton.cs.algs4.Stack;

public class Board {
    private int[][] board;
    private int hamming = -1;
    private int manhattanValue = -1;

    // construct a board from an n-by-n array of blocks
    // (where blocks[i][j] = block in row i, column j)
    public Board(int[][] blocks) {
        if (blocks == null)
            throw new java.lang.IllegalArgumentException();

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
        if (hamming == -1) {
            hamming = 0;
            for (int i = 0; i < board.length; i++) {
                for (int j = 0; j < board[i].length; j++) {
                    int index = i * board.length + j + 1;
                    if (board[i][j] != index)
                        hamming++;
                }
            }
        }
        hamming--; // Decrease empty block
        return hamming;
    }

    // sum of Manhattan distances between blocks and goal
    public int manhattan() {
        if (manhattanValue == -1) {
            manhattanValue = 0;
            for (int i = 0; i < board.length; i++) {
                for (int j = 0; j < board[i].length; j++) {
                    int value = board[i][j];
                    if (value != 0) {
                        int index = i * board.length + j + 1;
                        if (value != index) {
                            value--; // Switch to zero based
                            int x = value % board.length;
                            int y = value / board.length;
                            manhattanValue += Math.abs(x - j) + Math.abs(y - i);
                        }
                    }
                }
            }
        }
        return manhattanValue;
    }

    // is this board the goal board?
    public boolean isGoal() {
        int index = 1;
        int lastIndex = board.length*board.length;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                int value = board[i][j];
                if (value != index && index != lastIndex)
                    return false;
                index++;
            }
        }
        return true;
    }

    // a board that is obtained by exchanging any pair of blocks
    public Board twin() {
        Board twin = new Board(board);
        if (board[0][0] == 0) {
            twin.board[0][1] = board[1][1];
            twin.board[1][1] = board[0][1];
        } else if (board[0][1] == 0) {
            twin.board[0][0] = board[1][0];
            twin.board[1][0] = board[0][0];
        // } else if (board[1][0] == 0) {
        //     twin.board[0][0] = board[0][1];
        //     twin.board[0][1] = board[0][0];
        } else {
            twin.board[0][0] = board[0][1];
            twin.board[0][1] = board[0][0];
        }
        return twin;
    }

    // does this board equal y?
    public boolean equals(Object y) {
        if (y == this) return true;
        if (y == null) return false;
        if (y.getClass() != this.getClass()) return false;
        Board that = (Board) y;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] != that.board[i][j])
                    return false;
            }
        }
        return true;
    }

    // all neighboring boards
    public Iterable<Board> neighbors() {
        Stack<Board> neighbors = new Stack<Board>();
        int row = -1;
        int col = -1;
        boolean dMove = false;
        boolean uMove = false;
        boolean lMove = false;
        boolean rMove = false;
        for (int i = 0; i < board.length; i++) {
            for (int j = 0; j < board[i].length; j++) {
                if (board[i][j] == 0) {
                    row = i;
                    col = j;
                    uMove = row > 0;
                    dMove = row < board.length - 1;
                    lMove = col > 0;
                    rMove = col < board.length - 1;
                    break;
                }
            }
            if (uMove || dMove || lMove || rMove)
                break;
        }
        if (dMove) {
            Board downBoard = new Board(board);
            downBoard.board[row + 1][col] = board[row][col];
            downBoard.board[row][col] = board[row + 1][col];
            neighbors.push(downBoard);
        }
        if (uMove) {
            Board upBoard = new Board(board);
            upBoard.board[row - 1][col] = board[row][col];
            upBoard.board[row][col] = board[row - 1][col];
            neighbors.push(upBoard);
        }
        if (lMove) {
            Board leftBoard = new Board(board);
            leftBoard.board[row][col - 1] = board[row][col];
            leftBoard.board[row][col] = board[row][col - 1];
            neighbors.push(leftBoard);
        }
        if (rMove) {
            Board rightBoard = new Board(board);
            rightBoard.board[row][col + 1] = board[row][col];
            rightBoard.board[row][col] = board[row][col + 1];
            neighbors.push(rightBoard);
        }
        return neighbors;
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
