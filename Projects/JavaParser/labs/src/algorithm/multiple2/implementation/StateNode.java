package algorithm.multiple2.implementation;

import ast.Exp;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class StateNode {

    private final Exp exp;
    private Set<Exp> hypotheses;
    private Set<Exp> shouldClose;
    private final Set<Exp> close;
    private boolean isClosed;
    private final int height;

    ERule rule;

    public StateNode(Exp exp, Set<Exp> hypotheses) {
        this(exp, hypotheses, new HashSet<>(), null, 0);
    }

    public StateNode(Exp exp, Set<Exp> hypotheses, Set<Exp> close) {
        this(exp, hypotheses, close, null, 0);
    }

    StateNode(Exp exp, Set<Exp> hypotheses, Set<Exp> close, int height) {
        this(exp, hypotheses, close, null, height);
    }

    StateNode(Exp exp, Set<Exp> hypotheses, Set<Exp> shouldClose, Exp hypothesis, int height) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.shouldClose = shouldClose;
        this.height = height;
        this.close = new HashSet<>();

        if (hypothesis != null)
            hypotheses.add(hypothesis);

        isClosed = hypotheses.contains(exp);
        if (isClosed)
            close.add(exp);
    }
    public void updateClose(Set<StateNode> transitions) {
        transitions.forEach(t->close.add(t.getExp()));
    }

    public void resetOpen() {
        isClosed = hypotheses.contains(exp);
    }

    public void addHypotheses(Set<Exp> hypotheses) {
        this.hypotheses = new HashSet<>(this.hypotheses);
        this.hypotheses.addAll(hypotheses);
    }

    public Set<Exp> getClose() {
        return close;
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
