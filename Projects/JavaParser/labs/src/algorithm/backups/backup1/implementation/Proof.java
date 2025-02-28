package algorithm.backups.backup1.implementation;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Proof implements Cloneable{

    private final Exp exp;
    private final Set<Exp> hypotheses;
    private final Set<Edge> edges;
    private boolean hasNeg;
    private final List<Proof> children;

    Proof(Exp exp) {
        this.exp = exp;
        this.hypotheses = new HashSet<>();
        this.edges = new HashSet<>();
        this.children = new ArrayList<>();
        this.hasNeg = false;
    }

    public int size() {
        int count = 1;
        for (Proof child : children)
            count += child.size();
        return count;
    }

    public Exp exp() {
        return exp;
    }

    public Proof addPath(Exp exp) {
        Proof proof = new Proof(exp);
        children.add(proof);
        return proof;
    }

    public boolean hasEdge(Edge edge) {
        return edges.contains(edge);
    }

    public void addEdge(Edge edge) {
        edges.add(edge);
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
        return hypotheses.contains(exp) || hasNeg;
    }

    @Override
    public Proof clone() {
        Proof clonedProof = new Proof(this.exp);
        for (Proof child : this.children)
            clonedProof.children.add(child.clone());
        return clonedProof;
    }

    private void buildString(StringBuilder sb, String prefix) {
        sb.append(prefix).append(exp).append("\n");
        for (Proof child : children)
            child.buildString(sb, prefix + "\t");
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        buildString(sb, "");
        return sb.toString();
    }
}