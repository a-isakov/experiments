import edu.princeton.cs.algs4.Digraph;
import edu.princeton.cs.algs4.In;

import java.util.HashSet;

public class WordNet {
    private Digraph digraph;
    private SAP sap;
    // private ArrayList<String> synsetArray;
    private HashSet<String> nouns;

    // constructor takes the name of the two input files
    public WordNet(String synsets, String hypernyms) {
        In synsetsInput = new In(synsets);
        In hypernymsInput = new In(hypernyms);

        // synsetArray = new ArrayList<String>();
        nouns = new HashSet<String>();
        while (!synsetsInput.isEmpty()) {
            String line = synsetsInput.readString();
            String[] values = line.split(",");
            nouns.add(values[1]);
        }

        digraph = new Digraph(nouns.size());
        while (!hypernymsInput.isEmpty()) {
            String line = hypernymsInput.readString();
            String[] values = line.split(",");
            int v = Integer.parseInt(values[0]);
            for (int i = 1; i < values.length; i++) {
                int w = Integer.parseInt(values[i]);
                if (w < nouns.size())
                    digraph.addEdge(v, w);
            }
        }

        sap = new SAP(digraph);
    }

    // returns all WordNet nouns
    public Iterable<String> nouns() {
        return nouns;
    }

    // is the word a WordNet noun?
    public boolean isNoun(String word) {
        if (word == null)
            throw new NullPointerException("word parameter is null");
        // for (String s: synsetArray) {
        //     if (s.equals(word))
        //         return true;
        // }
        return nouns.contains(word);
    }

    // distance between nounA and nounB (defined below)
    public int distance(String nounA, String nounB) {
        return 0;
    }

    // a synset (second field of synsets.txt) that is the common ancestor of nounA and nounB
    // in a shortest ancestral path (defined below)
    public String sap(String nounA, String nounB) {
        return "";
    }

    // do unit testing of this class
    // public static void main(String[] args) {
    //     WordNet test = new WordNet("synsets3.txt", "hypernymsTwoCommonAncestors.txt");
    // }
}
