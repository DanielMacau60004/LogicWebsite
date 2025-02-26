package algorithm.multiple1.implementation;

import ast.Exp;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class StateNode {

    private final Exp exp;
    private Set<Exp> hypotheses;
    private Set<Exp> shouldClose;
    private boolean isClosed;
    private final int height;

    ERule rule;

    public StateNode(Exp exp, Set<Exp> hypotheses) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.shouldClose = new HashSet<>();
        this.height = 0;

        isClosed = hypotheses.contains(exp);
    }

    public StateNode(Exp exp, Set<Exp> hypotheses, Set<Exp> shouldClose) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.shouldClose = shouldClose;
        this.height = 0;

        isClosed = hypotheses.contains(exp);
    }

    StateNode(Exp exp, Set<Exp> hypotheses, Set<Exp> shouldClose, int height) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.shouldClose = shouldClose;
        this.height = height;

        isClosed = hypotheses.contains(exp);
    }

    StateNode(Exp exp, Set<Exp> hypotheses, Set<Exp> shouldClose, Exp hypothesis, int height) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.shouldClose = shouldClose;
        this.height = height;

        hypotheses.add(hypothesis);
        isClosed = hypotheses.contains(exp);
    }

    public void resetOpen() {
        isClosed = hypotheses.contains(exp);
    }

    public void addHypotheses(Set<Exp> hypotheses) {
        this.hypotheses = new HashSet<>(this.hypotheses);
        this.hypotheses.addAll(hypotheses);
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

    public boolean hasHypothesis(Exp exp) {
        return hypotheses.contains(exp);
    }

    public StateNode transit(Exp exp, Exp hypothesis, boolean shouldClose) {
        Set<Exp> close = this.shouldClose;
        if(shouldClose && hypothesis != null) {
            close = new HashSet<>(this.shouldClose);
            close.add(hypothesis);
        }

        if (hypothesis != null) return new StateNode(exp,
                new HashSet<>(this.hypotheses), close, hypothesis, height + 1);
        return new StateNode(exp, new HashSet<>(this.hypotheses), close, height + 1);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StateNode stateNode = (StateNode) o;
        return Objects.equals(exp, stateNode.exp) && Objects.equals(hypotheses, stateNode.hypotheses) && Objects.equals(shouldClose, stateNode.shouldClose);
    }

    @Override
    public int hashCode() {
        return Objects.hash(exp, hypotheses, shouldClose);
    }

    @Override
    public String toString() {
        return exp + "   hypotheses:" + hypotheses.toString();
    }
}
