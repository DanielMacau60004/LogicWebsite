package algorithm.backups.backup1.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;

import java.util.*;

public class Solution {

    private LinkedList<Solution> nextPaths; //Placeholders
    private List<Exp> path;
    private Set<Exp> hypotheses;
    private Set<Edge> edges;
    private boolean hasNeg;

    Solution(Exp exp) {
        this(List.of(exp), new HashSet<>(), new HashSet<>(), new LinkedList<>());
        hasNeg = false;
    }

    Solution(List<Exp> path, Set<Exp> hypotheses, Set<Edge> edges, LinkedList<Solution> nextPaths) {
        this.path = path;
        this.hypotheses = hypotheses;
        this.edges = edges;
        this.nextPaths = nextPaths;
    }

    public void addNextProof(Solution nextProof) {
        nextPaths.add(nextProof);
    }

    public int size() {
        return path.size();
    }

    public void addPath(Exp exp) {
        path.add(exp);
    }

    public boolean hasEdge(Edge edge) {
        return edges.contains(edge);
    }

    public void addEdge(Edge edge) {
        edges.add(edge);
    }

    public Exp last() {
        return path.get(path.size() - 1);
    }

    public boolean hasHypothesis(Exp exp) {
        return hypotheses.contains(exp);
    }

    public void addHypothesis(Exp exp) {
        hypotheses.add(exp);

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        hasNeg = hypotheses.contains(neg);
    }

    public boolean isClosed() {
        return hypotheses.contains(last()) || hasNeg;
    }

    public Solution shift() {
        boolean shift = false;
        while((hypotheses.contains(last()) || hasNeg) && !nextPaths.isEmpty()) { //is closed
            Solution next = nextPaths.removeFirst();
            hypotheses = next.hypotheses;
            edges = next.edges;
            hasNeg = next.hasNeg;
            path.add(new ASTLiteral("-"));
            path.add(next.last());
            shift = true;
        }
        return shift ? this : null;
    }


    public Solution clone() {
        return new Solution(new ArrayList<>(path), new HashSet<>(hypotheses), new HashSet<>(edges),
                new LinkedList<>(nextPaths));
    }

    @Override
    public String toString() {
        return "Path: " + path + ", Hypotheses: " + hypotheses;
    }
}