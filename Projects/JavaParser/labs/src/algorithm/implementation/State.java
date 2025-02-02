package algorithm.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class State {

    private final Exp exp;
    private final Set<Exp> hypotheses;
    private final Set<Edge> edges;
    private boolean hasNeg;


    public State(Exp exp) {
        this(exp, new HashSet<>(), new HashSet<>());
    }

    public State(Exp exp, Set<Exp> hypotheses, Set<Edge> edges) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.edges = edges;
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

    public void addHypothesis(Exp exp) {
        hypotheses.add(exp);
        hasNeg = hasNegation(exp);
    }

    public boolean isClosed() {
        return hypotheses.contains(exp) || hasNeg;
    }

    protected State clone(Exp exp) {
        return new State(exp, new HashSet<>(hypotheses), new HashSet<>(edges));
    }

    @Override
    public String toString() {
        return "\n\tExp: " + exp + " Hypotheses:" + hypotheses+" " + isClosed();
    }
}
