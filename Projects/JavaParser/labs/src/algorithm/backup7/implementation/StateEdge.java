package algorithm.backup7.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class StateEdge {

    private final ERule rule;
    private final StateNode from;
    private final List<StateNode> transitions;

    StateEdge(ERule rule, StateNode from, StateNode transitions) {
        this.rule = rule;
        this.from = from;
        this.transitions = List.of(transitions);
    }

    StateEdge(ERule rule, StateNode from) {
        this.rule = rule;
        this.from = from;
        this.transitions = new ArrayList<>();
    }

    public StateEdge addTransition(StateNode to) {
        transitions.add(to);
        return this;
    }

    public List<StateNode> getTransitions() {
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
