package algorithm.implementation.state;

import ast.Exp;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class StateNode {

    private final Exp exp;
    private final Set<Exp> premisses;
    private final Set<Exp> hypotheses;
    private boolean isClosed;
    private final int height;

    public StateNode(Exp exp, Set<Exp> premisses) {
        this(exp, premisses, new HashSet<>(),null, 0);
    }

    public StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses) {
        this(exp, premisses, hypotheses, null, 0);
    }

    public StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses, int height) {
        this(exp, premisses, hypotheses, null, height);
    }

    StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses, Exp hypothesis, int height) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.premisses = premisses;
        this.height = height;

        if (hypothesis != null)
            hypotheses.add(hypothesis);

        resetClose();
    }

    public int getHeight() {
        return height;
    }

    public Exp getExp() {
        return exp;
    }

    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed() {
        isClosed = true;
    }

    public void resetClose() {
        isClosed = hypotheses.contains(exp) || premisses.contains(exp);
    }

    public boolean hasHypothesis(Exp exp) {
        return hypotheses.contains(exp);
    }

    public StateNode transit(Exp exp, Exp hypothesis) {
        if (hypothesis != null) return new StateNode(exp,
                premisses, new HashSet<>(this.hypotheses), hypothesis, height + 1);
        return new StateNode(exp, premisses, this.hypotheses, height + 1);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StateNode stateNode = (StateNode) o;
        return Objects.equals(exp, stateNode.exp) && Objects.equals(hypotheses, stateNode.hypotheses);
    }

    @Override
    public int hashCode() {
        return Objects.hash(exp, hypotheses);
    }

    @Override
    public String toString() {
        return exp + " hypotheses:" + hypotheses.toString();
    }
}
