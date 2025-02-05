package algorithm.backup3.implementation;

import ast.Exp;

import java.util.Objects;

public class Transition {
    Exp to;
    Exp constraint;
    Exp produces;

    public Transition(Exp to, Exp constraint, Exp produces) {
        this.to = to;
        this.constraint = constraint;
        this.produces = produces;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transition head = (Transition) o;
        return Objects.equals(to, head.to) && Objects.equals(constraint, head.constraint) && Objects.equals(produces, head.produces);
    }

    @Override
    public int hashCode() {
        return Objects.hash(to, constraint, produces);
    }

    @Override
    public String toString() {
        return to+" constraint:"+constraint+" produces:"+produces+" ";
    }
}
