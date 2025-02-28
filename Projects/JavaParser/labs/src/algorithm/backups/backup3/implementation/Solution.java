package algorithm.backups.backup3.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Solution {

    private final List<Exp> path;
    private State currentState;
    private final LinkedList<State> nextStates;

    List<State> listOfStates;

    Solution(Exp exp) {
        this(List.of(exp), new State(exp), new LinkedList<>(), new LinkedList<>());
    }

    Solution(List<Exp> path, State currentState, LinkedList<State> nextStates, List<State> listOfStates) {
        this.path = path;
        this.currentState = currentState;
        this.nextStates = nextStates;
        this.listOfStates = listOfStates;
        listOfStates.add(currentState);
    }

    public State getCurrentState() {
        return currentState;
    }

    public void addNextProof(Solution nextProof) {
        nextStates.add(nextProof.currentState);
    }

    public int size() {
        return path.size();
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
            path.add(new ASTLiteral("-"));
            path.add(currentState.getExp());
            swap = true;
            listOfStates.add(currentState);
        }

        return swap;
    }

    public Solution clone(Exp exp) {
        List<Exp> path = new ArrayList<>(this.path);
        path.add(exp);
        return new Solution(new ArrayList<>(path), currentState.clone(exp), new LinkedList<>(nextStates),
                new ArrayList<>(this.listOfStates));
    }

    @Override
    public String toString() {
        return "Path: " + path;
    }
}