package algorithm.backup3.implementation;

import ast.Exp;

import java.util.List;
import java.util.Objects;

public class Edge {

    List<Exp> to;
    Exp constraint;
    Exp produces;

    Edge(Exp to, Exp constraint, Exp produces) {
        this(List.of(to),constraint,produces);
    }

    Edge(List<Exp> to, Exp constraint, Exp produces) {
        this.to = to;
        this.constraint = constraint;
        this.produces = produces;
    }

    @Override
    public String toString() {
        return to + " requires[" + constraint + "], produces[" + produces + "]";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Edge edge = (Edge) o;
        return Objects.equals(to, edge.to) && Objects.equals(constraint, edge.constraint) && Objects.equals(produces, edge.produces);
    }

    @Override
    public int hashCode() {
        return Objects.hash(to, constraint, produces);
    }
}