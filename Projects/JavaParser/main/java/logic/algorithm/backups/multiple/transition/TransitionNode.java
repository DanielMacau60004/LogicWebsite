package logic.algorithm.backups.multiple.transition;

import logic.ast.Exp;

import java.util.Objects;

public class TransitionNode {

    private Exp to;
    private Exp produces;

    TransitionNode(Exp to, Exp produces) {
        this.to = to;
        this.produces = produces;
    }

    public Exp getTo() {
        return to;
    }

    public Exp getProduces() {
        return produces;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransitionNode that = (TransitionNode) o;
        return Objects.equals(to, that.to) && Objects.equals(produces, that.produces);
    }

    @Override
    public int hashCode() {
        return Objects.hash(to, produces);
    }
}
