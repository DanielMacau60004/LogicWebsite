package algorithm.backup6.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.logic.ASTOr;
import ast.symbols.ASTParenthesis;

import java.util.*;

public class State {

    final Edge edge;
    final Exp exp;
    final Set<Exp> hypotheses;
    private final Set<ASTOr> ors;
    private boolean hasNeg;

    final List<State> children;
    final State previous;

    public State(Exp exp, State previous, Edge edge) {
        this(exp, new HashSet<>(), new HashSet<>(), previous, new ArrayList<>(), edge);
    }

    public State(Exp exp, Set<Exp> hypotheses, Set<ASTOr> ors, State previous, List<State> children, Edge edge) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.ors = ors;
        this.previous = previous;
        this.children = children;
        this.edge = edge;
    }

    public Exp getExp() {
        return exp;
    }

    private boolean hasNegation(Exp exp) {
        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        return hypotheses.contains(neg);
    }

    public boolean hasHypothesis(Exp exp) {
        return hypotheses.contains(exp);
    }

    public boolean hasOr(ASTOr or) {
        return ors.contains(or);
    }
    public int orSize() {
        return ors.size();
    }

    public void addOr(ASTOr or) {
        ors.add(or);
    }

    public void addHypothesis(Exp exp) {
        hypotheses.add(exp);
        hasNeg = hasNegation(exp);
    }

    public boolean isClosed() {
        return hypotheses.contains(exp) || hasNeg;
    }

    protected State transit(Exp exp, Edge edge) {
        State state = new State(exp, new HashSet<>(hypotheses), new HashSet<>(ors), this,
                new ArrayList<>(), edge);
        children.add(state);
        return state;
    }

    @Override
    public String toString() {
        return "Exp: " + exp + " Hypotheses:" + hypotheses;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        State state = (State) o;
        return hasNeg == state.hasNeg && Objects.equals(exp, state.exp) && Objects.equals(hypotheses, state.hypotheses);
    }

    @Override
    public int hashCode() {
        return Objects.hash(exp, hypotheses, hasNeg);
    }
}
