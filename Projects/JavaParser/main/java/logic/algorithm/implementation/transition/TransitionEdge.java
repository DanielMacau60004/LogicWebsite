package logic.algorithm.implementation.transition;

import logic.algorithm.ERule;
import logic.ast.Exp;
import logic.ast.types.ASTVariable;

import java.util.*;

public class TransitionEdge {

    private final ERule rule;
    private final List<TransitionNode> transitions;

    TransitionEdge(ERule rule, Exp to, Exp produces) {
        this(rule);
        addTransition(to, produces);
    }

    TransitionEdge(ERule rule, Exp to) {
        this(rule);
        addTransition(to, null);
    }

    TransitionEdge(ERule rule) {
        this.rule = rule;
        this.transitions = new LinkedList<>();
    }

    public TransitionEdge addTransition(Exp to, Exp produces, ASTVariable free) {
        transitions.add(new TransitionNode(to, produces, free));
        return this;
    }

    public TransitionEdge addTransition(Exp to, Exp produces) {
        transitions.add(new TransitionNode(to, produces, null));
        return this;
    }

    public TransitionEdge addTransition(Exp to) {
        transitions.add(new TransitionNode(to, null, null));
        return this;
    }

    public List<TransitionNode> getTransitions() {
        return transitions;
    }

    public ERule getRule() {
        return rule;
    }

    @Override
    public String toString() {
        String str = rule.name() + " ";
        for (TransitionNode transition : transitions)
            str += "[" + transition.getTo() + "," + transition.getProduces() + ", " + transition.getFree() + "] ";
        return str;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TransitionEdge that = (TransitionEdge) o;
        return rule == that.rule && Objects.equals(transitions, that.transitions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rule, transitions);
    }


}
