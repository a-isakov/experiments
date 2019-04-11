import java.util.Iterator;

public class RandomizedQueue<Item> implements Iterable<Item> {
    private int size = 0;
    private int head = 0;
    private int tail = 0;
    private Item[] a;

    // construct an empty randomized queue
    public RandomizedQueue() {

    }

    // is the randomized queue empty?
    public boolean isEmpty() {
        return size == 0;
    }

    // return the number of items on the randomized queue
    public int size() {
        return size;
    }

    private void doubleSize() {
        // TODO: double size and shift array
        Item[] newArray = (Item[]) new Object[a.length*2];
        int ind = tail + newArray.length/4 + 1;
        if (ind > newArray.length)
            ind--;
        for (int i = tail; i > head; i--) {
            newArray[ind] = a[i - 1];
            ind--;
        }
        head = ind;
        tail = ind + newArray.length - 1;
        a = newArray;
    }

    // add the item
    public void enqueue(final Item item) {
        if (isEmpty()) {
            a = (Item[]) new Object[1];
            a[0] = item;
            head = 0;
            tail = 0;
        }
        else {
            if (head > 0) {
                a[head--] = item;
                // TODO: check how it works
            }
            else {
                if (size > a.length/2) {
                    // TODO: resize
                    doubleSize();
                    a[head--] = item;
                }
                else
                {
                    // TODO: shift array
                    int ind = tail + a.length/4 + 1;
                    if (ind > a.length)
                        ind--;
                    for (int i = tail; i > head; i--) {
                        a[ind] = a[i - 1];
                        ind--;
                    }
                    head = ind;
                    tail = ind + a.length - 1;
                }
                a[head--] = item;
            }
        }
        size++;
    }

    // remove and return a random item
    public Item dequeue() {
        return null;
    }

    // return a random item (but do not remove it)
    public Item sample() {
        return null;
    }

    // return an independent iterator over items in random order
    public Iterator<Item> iterator() {
        return null;
    }

    // unit testing (optional)
    public static void main(String[] args) {
        RandomizedQueue<String> rq = new RandomizedQueue<String>();
        rq.enqueue("1");
        rq.enqueue("2");
        rq.enqueue("3");
        rq.enqueue("4");
        rq.enqueue("5");
    }
}