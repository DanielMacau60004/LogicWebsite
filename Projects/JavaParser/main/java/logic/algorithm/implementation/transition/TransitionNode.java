package logic.algorithm.implementation.transition;

import logic.ast.Exp;
import logic.ast.types.ASTVariable;

import java.util.Objects;

public class TransitionNode {

    private final Exp to;
    private final Exp produces;
    private final ASTVariable free;

    TransitionNode(Exp to, Exp produces, ASTVariable free) {
        this.to = to;
        this.produces = produces;
        this.free = free;
    }

    public Exp getTo() {
        return to;
    }

    public ASTVariable getFree() {
        return free;
    }

    public Exp getProduces() {
        return produces;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransitionNode that = (TransitionNode) o;
        return Objects.equals(to, that.to) && Objects.equals(produces, that.produces)
                && Objects.equals(free, that.free);
    }

    @Override
    public int hashCode() {
        return Objects.hash(to, produces, free);
    }
}
