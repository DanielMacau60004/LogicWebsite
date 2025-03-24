package logic.algorithm.backups.backup6.implementation.newImp;

import logic.ast.Exp;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class TransitionEdge {

    private final ERule rule;
    private final List<Transition> transitions;

    TransitionEdge(ERule rule, Exp to, Exp constraint, Exp produces) {
        this(rule);
        addTransition(to, constraint, produces);
    }

    TransitionEdge(ERule rule) {
        this.rule = rule;
        this.transitions = new ArrayList<>();
    }

    public TransitionEdge addTransition(Exp to, Exp constraint, Exp produces) {
        transitions.add(new Transition(to, constraint, produces));
        return this;
    }

    public boolean canTransit(StateNode node) {
        return transitions.stream().allMatch(it -> it.constraint == null || node.hasHypothesis(it.constraint));
    }

    public List<Transition> getTransitions() {
        return transitions;
    }

    public ERule getRule() {
        return rule;
    }

    @Override
    public String toString() {
        return transitions.toString();
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

    public String toFormatString(TransitionGraph graph) {
        String str = rule.name() + " ";
        for (Transition transition : transitions)
            str += "[" + transition.to + "," + transition.constraint + "," + transition.produces + "] ";
        return str;
    }

}
