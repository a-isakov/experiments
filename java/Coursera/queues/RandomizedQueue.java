import edu.princeton.cs.algs4.StdRandom;
import java.util.Iterator;

public class RandomizedQueue<Item> implements Iterable<Item> {
    private int size = 0;
    private Item[] a;

    private class RandomizedQueueIterator implements Iterator<Item> {
        private int index = -1;
        private int[] indexes;

        public RandomizedQueueIterator() {
            if (size != 0) {
                indexes = new int[size];
                for (int i = 1; i < indexes.length; i++) {
                    indexes[i] = i;
                }
                StdRandom.shuffle(indexes);
                index = 0;
            }
        }

        public boolean hasNext() {
            if (index == -1)
                return false;

            return index < indexes.length;
        }

        public Item next() {
            if (index == -1 || index >= indexes.length)
                throw new java.util.NoSuchElementException("Wrong index");

            int i = indexes[index];
            if (i >= a.length)
                throw new java.util.NoSuchElementException("Wrong index");
            Item ret = a[i];
            index++;
            return ret;
        }
    }

    // construct an empty randomized queue
    public RandomizedQueue() { }

    // is the randomized queue empty?
    public boolean isEmpty() {
        return size == 0;
    }

    // return the number of items on the randomized queue
    public int size() {
        return size;
    }

    // add the item
    public void enqueue(final Item item) {
        if (item == null)
            throw new IllegalArgumentException("Null argument");

        // Always add to tail
        if (isEmpty()) {
            a = (Item[]) new Object[1];
            a[0] = item;
        }
        else {
            if (size == a.length) {
                // Double size
                Item[] newArray = (Item[]) new Object[a.length*2];
                for (int i = 0; i < a.length; i++) {
                    newArray[i] = a[i];
                }
                a = newArray;
            }
            a[size] = item;
        }
        size++;
    }

    // remove and return a random item
    public Item dequeue() {
        if (size == 0)
            throw new java.util.NoSuchElementException("Empty storage");

        Item ret = null;
        int randomIndex = size == 1 ? 0 : StdRandom.uniform(size);
        if (randomIndex == size - 1) {
            ret = a[randomIndex];
            a[randomIndex] = null;
        }
        else {
            // shift array left
            ret = a[randomIndex];
            for (int i = randomIndex; i < size - 1; i++) {
                a[i] = a[i + 1];
                a[i + 1] = null;
            }
        }
        size--;
        if (size == a.length/4) {
            // Resize down
            Item[] newArray = (Item[]) new Object[a.length/2];
            for (int i = 0; i < size; i++) {
                newArray[i] = a[i];
            }
            a = newArray;
        }
        return ret;
    }

    // return a random item (but do not remove it)
    public Item sample() {
        if (size == 0)
            throw new java.util.NoSuchElementException("Empty storage");

        return a[StdRandom.uniform(size)];
    }

    // return an independent iterator over items in random order
    public Iterator<Item> iterator() {
        return new RandomizedQueueIterator();
    }

    // unit testing (optional)
    // public static void main(String[] args) {
    //     RandomizedQueue<String> rq = new RandomizedQueue<String>();
    //     rq.enqueue("1");
    //     rq.enqueue("2");
    //     rq.enqueue("3");
    //     rq.enqueue("4");
    //     rq.enqueue("5");
    //     for (String s: rq) {
    //         s = s.concat("-");
    //     }
    // }
}