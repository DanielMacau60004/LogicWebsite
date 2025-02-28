package algorithm.backups.backup7.implementation;

import ast.Exp;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class TransitionEdge {

    private final ERule rule;
    private final Set<Transition> transitions;

    TransitionEdge(ERule rule, Exp to, Exp constraint, Exp produces, boolean needToBeClosed) {
        this(rule);
        addTransition(to, constraint, produces, needToBeClosed);
    }

    TransitionEdge(ERule rule) {
        this.rule = rule;
        this.transitions = new HashSet<>();
    }

    public TransitionEdge addTransition(Exp to, Exp constraint, Exp produces, boolean needToBeClosed) {
        transitions.add(new Transition(to, constraint, produces, needToBeClosed));
        return this;
    }

    public boolean canTransit(StateNode node) {
        return transitions.stream().allMatch(it -> it.constraint == null || node.hasHypothesis(it.constraint));
    }

    public Set<Transition> getTransitions() {
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
