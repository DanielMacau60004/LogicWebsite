package algorithm.backup5.implementation;

import java.util.List;
import java.util.Objects;

public class Edge {

    final List<Branch> heads;

    Edge(Branch head) {
        heads = List.of(head);
    }

    Edge(List<Branch> heads) {
        this.heads = heads;
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
