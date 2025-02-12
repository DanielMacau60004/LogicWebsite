package algorithm.backup5.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.logic.ASTOr;
import ast.symbols.ASTParenthesis;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class State {

    private final Exp exp;
    private final Set<Exp> hypotheses;
    private final Set<Edge> edges;
    private final Set<ASTOr> ors;
    private boolean hasNeg;

    public State(Exp exp) {
        this(exp, new HashSet<>(), new HashSet<>(), new HashSet<>());
    }

    public State(Exp exp, Set<Exp> hypotheses, Set<Edge> edges, Set<ASTOr> ors) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.edges = edges;
        this.ors = ors;
    }

    public Exp getExp() {
        return exp;
    }

    private boolean hasNegation(Exp exp) {
        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        return hypotheses.contains(neg);
    }

    public boolean hasEdge(Edge edge) {
        return edges.contains(edge);
    }

    public void addEdge(Edge edge) {
        edges.add(edge);
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

    protected State clone(Exp exp) {
        return new State(exp, new HashSet<>(hypotheses), new HashSet<>(edges), new HashSet<>(ors));
    }

    @Override
    public String toString() {
        return "\n\tExp: " + exp + " Hypotheses:" + hypotheses + " Closed:";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        State state = (State) o;
        return hasNeg == state.hasNeg && Objects.equals(exp, state.exp) && Objects.equals(hypotheses, state.hypotheses) && Objects.equals(edges, state.edges) && Objects.equals(ors, state.ors);
    }

    @Override
    public int hashCode() {
        return Objects.hash(exp, hypotheses, edges, ors, hasNeg);
    }
}
