package algorithm.multiple2.implementation;

import java.util.*;

public class StateEdge {

    private final ERule rule;
    private final StateNode from;
    private final Set<StateNode> transitions;

    StateEdge(ERule rule, StateNode from, StateNode transitions) {
        this.rule = rule;
        this.from = from;
        this.transitions = Set.of(transitions);
    }

    StateEdge(ERule rule, StateNode from) {
        this.rule = rule;
        this.from = from;
        this.transitions = new HashSet<>();
    }

    public StateEdge addTransition(StateNode to) {
        transitions.add(to);
        return this;
    }

    public Set<StateNode> getTransitions() {
        return transitions;
    }

    public boolean isClosed() {
        return transitions.stream().allMatch(StateNode::isClosed);
    }

    public StateNode getFrom() {
        return from;
    }

    public ERule getRule() {
        return rule;
    }

    @Override
    public String toString() {
        return transitions.toString()+" closed: " + isClosed();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StateEdge edge = (StateEdge) o;
        return rule == edge.rule && Objects.equals(from, edge.from) && Objects.equals(transitions, edge.transitions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(rule, from, transitions);
    }
}
