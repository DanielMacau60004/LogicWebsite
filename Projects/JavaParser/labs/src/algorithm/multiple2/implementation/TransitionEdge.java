package algorithm.multiple2.implementation;

import ast.Exp;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class TransitionEdge {

    private final ERule rule;
    private final Set<Transition> transitions;

    TransitionEdge(ERule rule, Exp to, Exp produces, boolean needToBeClosed) {
        this(rule);
        addTransition(to, produces, needToBeClosed);
    }

    TransitionEdge(ERule rule, Exp to) {
        this(rule);
        addTransition(to, null, false);
    }

    TransitionEdge(ERule rule) {
        this.rule = rule;
        this.transitions = new HashSet<>();
    }

    public TransitionEdge addTransition(Exp to, Exp produces, boolean needToBeClosed) {
        transitions.add(new Transition(to, produces, needToBeClosed));
        return this;
    }

    public TransitionEdge addTransition(Exp to) {
        transitions.add(new Transition(to, null, false));
        return this;
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
            str += "[" + transition.to + "," + transition.produces + "] ";
        return str;
    }

}
