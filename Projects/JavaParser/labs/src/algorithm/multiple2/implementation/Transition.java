package algorithm.multiple2.implementation;

import ast.Exp;

import java.util.Objects;

public class Transition {
    Exp to;
    Exp produces;
    boolean requiresToBeClosed;

    Transition(Exp to, Exp produces, boolean requiresToBeClosed) {
        this.to = to;
        this.produces = produces;
        this.requiresToBeClosed = requiresToBeClosed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transition that = (Transition) o;
        return requiresToBeClosed == that.requiresToBeClosed && Objects.equals(to, that.to) && Objects.equals(produces, that.produces);
    }

    @Override
    public int hashCode() {
        return Objects.hash(to, produces, requiresToBeClosed);
    }
}
