package algorithm.implementation.newImp;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class TransitionEdge {

    private final ERule rule;
    private final List<Transition> transitions;

    static class Transition {
        Integer to;
        Integer constraint;
        Integer produces;

        Transition(Integer to, Integer constraint, Integer produces) {
            this.to = to;
            this.constraint = constraint;
            this.produces = produces;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Transition that = (Transition) o;
            return Objects.equals(to, that.to) && Objects.equals(constraint, that.constraint) && Objects.equals(produces, that.produces);
        }

        @Override
        public int hashCode() {
            return Objects.hash(to, constraint, produces);
        }
    }

    TransitionEdge(ERule rule, Integer to, Integer constraint, Integer produces) {
        this(rule);
        addTransition(to, constraint, produces);
    }

    TransitionEdge(ERule rule) {
        this.rule = rule;
        this.transitions = new ArrayList<>();
    }

    public TransitionEdge addTransition(Integer to, Integer constraint, Integer produces) {
        transitions.add(new Transition(to, constraint, produces));
        return this;
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
            str += "[" + graph.getExp(transition.to) + "," + graph.getExp(transition.constraint) + "," +
                    graph.getExp(transition.produces) + "] ";
        return str;
    }

}
