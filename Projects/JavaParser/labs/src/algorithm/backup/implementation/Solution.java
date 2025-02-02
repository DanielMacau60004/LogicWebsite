package algorithm.backup.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Solution {

    private final List<Exp> path;
    private final Set<Exp> hypotheses;
    private final Set<Edge> edges;
    private boolean hasNeg;

    Solution(Exp exp) {
        this(List.of(exp), new HashSet<>(), new HashSet<>());
        hasNeg = false;
    }

    Solution(List<Exp> path, Set<Exp> hypotheses, Set<Edge> edges) {
        this.path = path;
        this.hypotheses = hypotheses;
        this.edges = edges;
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

    public Solution clone() {
        return new Solution(new ArrayList<>(path), new HashSet<>(hypotheses), new HashSet<>(edges));
    }

    @Override
    public String toString() {
        return "Path: " + path + ", Hypotheses: " + hypotheses;
    }
}