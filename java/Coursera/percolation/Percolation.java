import edu.princeton.cs.algs4.WeightedQuickUnionUF;

public class Percolation {

    private boolean[][] grid;
    private final int gridSize;
    private final int topVNodeIndex;
    private final int bottomVNodeIndex;
    private int openSites = 0;
    private final WeightedQuickUnionUF uf;
    private final WeightedQuickUnionUF ufTop; // for top connectivity only

    // create n-by-n grid, with all sites blocked
    public Percolation(int n) {
        if (n <= 0)
            throw new IllegalArgumentException("size should be positive");

        long freeMemory = Runtime.getRuntime().freeMemory();
        if (11*n*n + 128*n + 1024 >= freeMemory)
            throw new IllegalArgumentException("too big n");

        gridSize = n;
        grid = new boolean[gridSize][gridSize];
        for (int col = 0; col < gridSize; col++) {
            for (int row = 0; row < gridSize; row++) {
                grid[row][col] = false;
            }
        }

        // Add two virtual nodes
        int elements = gridSize*gridSize;
        uf = new WeightedQuickUnionUF(elements + 2);
        ufTop = new WeightedQuickUnionUF(elements + 1);
        topVNodeIndex = elements;
        bottomVNodeIndex = elements + 1;
    }

    // open site (row, col) if it is not open already
    public void open(int row, int col) {
        checkInputs(row, col);
        if (!grid[row - 1][col - 1]) {
            grid[row - 1][col - 1] = true;
            openSites++;
        }

        int index = calcIndex(row, col);
        if (row > 1 && grid[row - 2][col - 1]) {
            uf.union(index, calcIndex(row - 1, col));
            ufTop.union(index, calcIndex(row - 1, col));
        }
        if (row < gridSize && grid[row][col - 1]) {
            uf.union(index, calcIndex(row + 1, col));
            ufTop.union(index, calcIndex(row + 1, col));
        }
        if (col > 1 && grid[row - 1][col - 2]) {
            uf.union(index, calcIndex(row, col - 1));
            ufTop.union(index, calcIndex(row, col - 1));
        }
        if (col < gridSize && grid[row - 1][col]) {
            uf.union(index, calcIndex(row, col + 1));
            ufTop.union(index, calcIndex(row, col + 1));
        }

        if (row == 1) {
            uf.union(index, topVNodeIndex);
            ufTop.union(index, topVNodeIndex);
        }
        if (row == gridSize) {
            // if (isFull(row, col)) {
                uf.union(index, bottomVNodeIndex);
            // }
        }
    }

    // is site (row, col) open?
    public boolean isOpen(int row, int col) {
        checkInputs(row, col);
        return grid[row - 1][col - 1];
    }

    // is site (row, col) full?
    public boolean isFull(int row, int col) {
        checkInputs(row, col);
        int index = calcIndex(row, col);
        return ufTop.connected(index, topVNodeIndex);
    }

    // number of open sites
    public int numberOfOpenSites() {
        return openSites;
    }

    // does the system percolate?
    public boolean percolates() {
        // for (int col = 1; col <= gridSize; col++) {
        //     if (uf.connected(topVNodeIndex, calcIndex(gridSize, col)))
        //         return true;
        // }
        // return false;

        return uf.connected(topVNodeIndex, bottomVNodeIndex);
    }

    // public static void main(String[] args) {
    //
    // }

    private void checkInputs(final int row, final int col) {
        if (row > gridSize || row < 1 || col > gridSize || col < 1)
            throw new IllegalArgumentException("Index out of bounds");
    }

    // convert grid coordinates into line index
    private int calcIndex(final int row, final int col) {
        checkInputs(row, col);
        return (col - 1) + gridSize*(row - 1);
    }
}
