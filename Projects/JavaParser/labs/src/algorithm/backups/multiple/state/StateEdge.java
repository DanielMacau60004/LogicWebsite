package algorithm.backups.multiple.state;

import algorithm.ERule;

import java.util.*;

public class StateEdge {

    private final ERule rule;
    private final Set<StateNode> transitions;

    StateEdge(ERule rule, StateNode transition) {
        this.rule = rule;
        this.transitions = new HashSet<>();

        transitions.add(transition);
    }

    StateEdge(ERule rule) {
        this.rule = rule;
        this.transitions = new HashSet<>();
    }

    public StateEdge addTransition(StateNode to) {
        transitions.add(to);
        return this;
    }

    public Set<StateNode> getTransitions() {return transitions;}

    public boolean isClosed() {return transitions.stream().allMatch(StateNode::isClosed);}

    public ERule getRule() {
        return rule;
    }

    @Override
    public String toString() {
        return transitions.toString() + " closed: " + isClosed() + " rule: " + rule;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StateEdge edge = (StateEdge) o;
        return rule == edge.rule && Objects.equals(transitions, edge.transitions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rule, transitions);
    }

}
