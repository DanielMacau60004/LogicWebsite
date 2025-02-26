package algorithm.backup6.implementation;

import java.util.List;
import java.util.Objects;

public class Edge {

    final String rule;
    final List<Branch> heads;

    Edge(String rule, Branch head) {
        this.rule = rule;
        heads = List.of(head);
    }

    Edge(String rule, List<Branch> heads) {
        this.rule = rule;
        this.heads = heads;
    }

    public String getRule() {
        return rule;
    }

    @Override
    public String toString() {
        return heads.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge edge = (Edge) o;
        return Objects.equals(heads, edge.heads);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(heads);
    }
}
