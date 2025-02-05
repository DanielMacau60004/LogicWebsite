package algorithm.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import java.util.*;

public class Solution {

    private State currentState;
    private final LinkedList<State> nextStates;
    private int size;

    Solution(Exp exp) {
        this(0, new State(exp, null, null), new LinkedList<>());
    }

    Solution(int size, State currentState, LinkedList<State> nextStates) {
        this.size = size;
        this.currentState = currentState;
        this.nextStates = nextStates;

    }

    public State getCurrentState() {
        return currentState;
    }

    public void addNextProof(Solution nextProof) {
        nextStates.add(nextProof.currentState);
    }

    public int size() {
        return size;
    }

    public Exp last() {
        return currentState.getExp();
    }

    public boolean isClosed() {
        return currentState.isClosed() && nextStates.isEmpty();
    }

    public boolean swapState() {
        boolean swap = false;

        while(currentState.isClosed() && !nextStates.isEmpty()) { //is closed
            currentState = nextStates.removeFirst();
            swap = true;
        }

        return swap;
    }

    public Solution transit(Exp exp, Edge edge) {
        return new Solution(size++, currentState.transit(exp, edge), new LinkedList<>(nextStates));
    }

    @Override
    public String toString() {
        String solution = "";

        State s = currentState;
        while(s != null) {
            solution = s.exp + (s.edge == null ? "" : " ["+s.edge.rule+"]") +", "+ solution;
            s = s.previous;
        }

        return solution;
    }
}