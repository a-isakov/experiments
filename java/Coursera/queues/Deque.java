import java.util.Iterator;

public class Deque<Item> implements Iterable<Item> {
    private int size = 0;
    private Node first = null;
    private Node last = null;

    private class Node {
        Node prevNode = null;
        Node nextNode = null;
        Item nodeItem;

        public Node(final Item item) {
            nodeItem = item;
        }
    }
    private class DequeIterator implements Iterator<Item> {
        private Node current = first;

        public boolean hasNext() {
            return current != null;
        }

        public Item next() {
            if (current == null)
                throw new java.util.NoSuchElementException("Empty storage");

            Item item = current.nodeItem;
            current = current.nextNode;
            return item;
        }
    }

    // construct an empty deque
    public Deque() {
    }

    // is the deque empty?
    public boolean isEmpty() {
        return size == 0;
    }

    // return the number of items on the deque
    public int size() {
        return size;
    }

    // add the item to the front
    public void addFirst(final Item item) {
        Node newFirst = new Node(item);
        if (isEmpty()) {
            first = newFirst;
            last = newFirst;
        }
        else {
            newFirst.nextNode = first;
            first.prevNode = newFirst;
            first = newFirst;
        }
        size++;
    }

    // add the item to the end
    public void addLast(final Item item) {
        Node newLast = new Node(item);
        if (isEmpty()) {
            first = newLast;
            last = newLast;
        }
        else {
            newLast.prevNode = last;
            last.nextNode = newLast;
            last = newLast;
        }
        size++;
    }

    // remove and return the item from the front
    public Item removeFirst() {
        if (isEmpty())
            throw new java.util.NoSuchElementException("Empty storage");

        Item ret = first.nodeItem;
        if (size == 1) {
            first = null;
            last = null;
        }
        else {
            first.nextNode.prevNode = null;
            first = first.nextNode;
        }
        size--;

        return ret;
    }

    // remove and return the item from the end
    public Item removeLast() {
        if (isEmpty())
            throw new java.util.NoSuchElementException("Empty storage");

        Item ret = last.nodeItem;
        if (size == 1) {
            first = null;
            last = null;
        }
        else {
            last.prevNode.nextNode = null;
            last = last.prevNode;
        }
        size--;

        return ret;
    }

    // return an iterator over items in order from front to end
    public Iterator<Item> iterator() {
        if (isEmpty())
            throw new java.util.NoSuchElementException("Empty storage");

        return new DequeIterator();
    }

    // unit testing (optional)
    // public static void main(String[] args) {
    //     Deque<String> deque = new Deque<String>();
    //     deque.addFirst("first");
    //     deque.addFirst("new first");
    //     deque.addFirst("second first");
    //     String value = deque.removeFirst();
    //     value = deque.removeFirst();
    //     value = deque.removeFirst();
    //     value = deque.removeFirst();
    //     value = "";
    // }
}
