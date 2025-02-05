package algorithm.backup0.implementation;


import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;

import java.util.*;

public class StateMachine {

    static final Exp BOT = new ASTLiteral("⊥");

    Exp exp;
    Map<Exp, Set<Edge>> graph;


    public StateMachine(Exp exp) {
        graph = new HashMap<>();
        this.exp = exp;

        addNode(exp);
    }

    private Exp removeParenthesis(Exp exp) {
        if (exp instanceof ASTParenthesis par)
            exp = par.exp;
        return exp;
    }

    private void addNode(Exp exp) {
        if (graph.containsKey(exp))
            return;
        graph.put(removeParenthesis(exp), new HashSet<>());
        genBottomUp(exp);
        genTopDown(exp);
    }

    private void addEdge(Exp a, Exp b, Exp constraint, Exp produces) {
        a = removeParenthesis(a);
        b = removeParenthesis(b);
        addNode(a);
        addNode(b);
        graph.get(a).add(new Edge(b, removeParenthesis(constraint), removeParenthesis(produces)));
    }

    private void absurdityRule(Exp exp) {
        if (exp.equals(BOT))
            return;

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        addEdge(exp, BOT, null, neg);
        addEdge(BOT, exp, neg, null);
    }

    private void implicationIRule(Exp exp, ASTImplication imp) {
        addNode(imp.left);
        addEdge(exp, imp.right, null, imp.left);
    }

    private void negationIRule(Exp exp, ASTNot imp) {
        Exp notNeg = removeParenthesis(imp.exp);
        addNode(notNeg);
        addEdge(exp, BOT, null, notNeg);
        addEdge(BOT, exp, notNeg, null);
    }

    private void disjunctionIRule(Exp exp, ASTOr or) {
        addEdge(exp, or.left, null, null);
        addEdge(exp, or.right, null, null);
    }

    private void implicationERule(Exp exp, ASTImplication imp) {
        addEdge(imp.right, exp, imp.left, null);
        addEdge(imp.right, imp.left, exp, null);
    }

    private void conjunctionERule(Exp exp, ASTAnd and) {
        addEdge(and.left, exp, null, null);
        addEdge(and.right, exp, null, null);
    }

    private void genBottomUp(Exp exp) {
        exp = removeParenthesis(exp);
        absurdityRule(exp);

        if (exp instanceof ASTImplication imp)
            implicationIRule(exp, imp);
        else if (exp instanceof ASTNot not)
            negationIRule(exp, not);
    }

    private void genTopDown(Exp exp) {
        exp = removeParenthesis(exp);
        //absurdityRule(exp);

        if (exp instanceof ASTImplication imp)
            implicationERule(exp, imp);
        else if (exp instanceof ASTAnd and)
            conjunctionERule(exp, and);
        else if (exp instanceof ASTOr or)
            disjunctionIRule(exp, or);
    }

    public List<Solution> solve(Exp exp, int solutionSize, int solutionsLimit) {
        List<Solution> solutions = new ArrayList<>();
        Queue<Solution> queue = new LinkedList<>();

        queue.add(new Solution(exp));

        while (!queue.isEmpty()) {
            Solution solution = queue.poll();
            Exp current = solution.last();

            if (solution.size() >= solutionSize)
                continue;

            if (solution.isClosed()) {
                solutions.add(solution.clone());

                if (solutions.size() == solutionsLimit)
                    return solutions;
                continue;
            }

            for (Edge edge : graph.get(current)) {
                if (edge.constraint != null && !solution.hasHypothesis(edge.constraint))
                    continue;

                if (edge.to == BOT && solution.hasEdge(edge))
                    continue;

                Solution newSolution = solution.clone();
                newSolution.addPath(edge.to);

                if (edge.produces != null)
                    newSolution.addHypothesis(edge.produces);
                if (edge.to == BOT)
                    newSolution.addEdge(edge);

                queue.add(newSolution);

            }
        }

        return solutions;
    }


    @Override
    public String toString() {
        String str = "";
        for (Map.Entry<Exp, Set<Edge>> entry : graph.entrySet()) {
            str += entry.getKey() + ": \n";
            for (Edge edge : entry.getValue())
                str += "\t" + edge + "\n";
        }
        return str;
    }
}
