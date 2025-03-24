package logic.algorithm.implementation.state;

import logic.ast.Exp;
import logic.ast.types.ASTVariable;
import logic.interpreter.FOLFreeInterpreter;
import logic.utils.Utils;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class StateNode {

    private final Exp exp;
    private final Set<Exp> premisses;
    private final Set<Exp> hypotheses;

    private final Set<Exp> cannotClose;

    private boolean isClosed;
    private int height;

    public StateNode(Exp exp, Set<Exp> premisses) {
        this(exp, premisses, new HashSet<>(),null, 0, new HashSet<>());
    }

    public StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses) {
        this(exp, premisses, hypotheses, null, 0, new HashSet<>());
    }

    public StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses, Set<Exp> cannotClose) {
        this(exp, premisses, hypotheses, null, 0, cannotClose);
    }

    public StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses, int height) {
        this(exp, premisses, hypotheses, null, height, new HashSet<>());
    }

    public StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses, int height, Set<Exp> cannotClose) {
        this(exp, premisses, hypotheses, null, height, cannotClose);
    }

    StateNode(Exp exp, Set<Exp> premisses, Set<Exp> hypotheses, Exp hypothesis, int height,
              Set<Exp> cannotClose) {
        this.exp = exp;
        this.hypotheses = hypotheses;
        this.premisses = premisses;
        this.height = height;
        this.cannotClose = cannotClose;

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
        isClosed = (hypotheses.contains(exp) || premisses.contains(exp)) && !cannotClose.contains(exp);
    }

    public Set<Exp> getHypotheses() {
        return hypotheses;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public boolean hasHypothesis(Exp exp) {
        return hypotheses.contains(exp);
    }

    public Set<Exp> getCannotClose() {
        return cannotClose;
    }

    public StateNode transit(Exp exp, Exp hypothesis, ASTVariable notFree) {
        Set<Exp> cannotClose = new HashSet<>(this.cannotClose);

        if(notFree != null) {
            cannotClose.addAll(hypotheses.stream()
                    .filter(h-> FOLFreeInterpreter.isFree(h, notFree)).toList());
            cannotClose.addAll(premisses.stream()
                    .filter(p-> FOLFreeInterpreter.isFree(p, notFree)).toList());
        }

        if (hypothesis != null) return new StateNode(exp,
                premisses, new HashSet<>(this.hypotheses), hypothesis, height + 1, cannotClose);
        return new StateNode(exp, premisses, this.hypotheses, height + 1, cannotClose);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StateNode stateNode = (StateNode) o;
        return Objects.equals(hypotheses, stateNode.hypotheses) && Objects.equals(exp, stateNode.exp)
                && Objects.equals(cannotClose, stateNode.cannotClose);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hypotheses, exp, cannotClose);
    }

    @Override
    public String toString() {
        return exp + " hypotheses:" + hypotheses.toString()+" cannotClose:"+cannotClose.toString() ;
    }
}
