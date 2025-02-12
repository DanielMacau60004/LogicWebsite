package algorithm.implementation.newImp;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class StateNode {

    private final Exp exp;
     final Set<Exp> hypotheses;
    private boolean isClosed;
    private final int height;
    private Exp hypothesis;

    public StateNode(Exp exp, Set<Exp> hypotheses, int height) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.height = height;

        isClosed = hypotheses.contains(exp);
    }

    StateNode(Exp exp, Set<Exp> hypotheses, Exp hypothesis, int height) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.height = height;
        this.hypothesis = hypothesis;
        hypotheses.add(hypothesis);

        isClosed = hypotheses.contains(exp) || hasNegations(hypothesis);
    }

    public void resetOpen() {
        isClosed = hypotheses.contains(exp) || hasNegations(this.hypothesis);
    }

    private boolean hasNegations(Exp exp) {
        if (exp == null) return false;
        if (exp instanceof ASTNot not) if (hasHypothesis(ExpUtils.removeParenthesis(not.exp))) return true;

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        return hypotheses.contains(neg);
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

    public StateNode transit(Exp exp, Exp hypothesis) {
        if (hypothesis != null) return new StateNode(exp, new HashSet<>(this.hypotheses), hypothesis, height + 1);
        return new StateNode(exp, new HashSet<>(this.hypotheses), height + 1);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StateNode stateNode = (StateNode) o;
        return Objects.equals(exp,stateNode.exp) && Objects.equals(hypotheses, stateNode.hypotheses);
    }

    @Override
    public int hashCode() {
        return Objects.hash(exp, hypotheses);
    }

    @Override
    public String toString() {
        return exp + "   hypotheses:" + hypotheses.toString();
    }
}
