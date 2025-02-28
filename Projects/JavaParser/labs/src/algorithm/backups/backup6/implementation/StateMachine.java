package algorithm.backups.backup6.implementation;


import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;
import utils.Utils;

import java.util.*;

public class StateMachine {

    static final Exp BOT = new ASTLiteral("\\u22a5");

    private final Exp exp;
    private final Map<Exp, Set<Edge>> graph;
    private final Set<ASTOr> disjunctions;

    public StateMachine(Exp exp) {
        this.exp = exp;
        graph = new HashMap<>();
        disjunctions = new HashSet<>();

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

        exp = removeParenthesis(exp);
        if (this.exp != exp && exp instanceof ASTOr or)
            disjunctions.add(or);

        graph.put(exp, new HashSet<>());
        genBottomUp(exp);
        genTopDown(exp);
    }

    private void addEdge(String rule, Exp a, Branch branch) {
        addNode(a);
        addNode(branch.to);
        graph.get(a).add(new Edge(rule,branch));
    }

    private void addEdge(String rule, Exp a, List<Branch> branches) {
        addNode(a);
        branches.forEach(b -> {
            b.to = removeParenthesis(b.to);
            addNode(b.to);
        });
        graph.get(a).add(new Edge(rule, branches));
    }

    private void absurdityRule(Exp exp) {
        if (exp.equals(BOT))
            return;

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        addEdge("¬E", exp, new Branch(BOT, null, neg));
        addEdge(BOT.toString(), BOT, new Branch(exp, neg, null));
    }

    private void implicationIRule(Exp exp, ASTImplication imp) {
        addNode(imp.left);
        addEdge("→I", exp, new Branch(removeParenthesis(imp.right), null, removeParenthesis(imp.left)));
    }

    private void negationIRule(Exp exp, ASTNot imp) {
        Exp notNeg = removeParenthesis(imp.exp);
        addNode(notNeg);
        addEdge("¬E", exp, new Branch(BOT, null, notNeg));
        addEdge("¬I", BOT, new Branch(exp, notNeg, null));
    }

    private void disjunctionIRule(Exp exp, ASTOr or) {
        addEdge("∨Ir", exp, new Branch(removeParenthesis(or.left), null, null));
        addEdge("∨Il", exp, new Branch(removeParenthesis(or.right), null, null));
    }

    private Edge disjunctionERule(Exp exp, ASTOr or) {
        return new Edge("∨E (" +or+","+exp+","+exp+")" , List.of(
                new Branch(or, null, null),
                new Branch(exp, null, removeParenthesis(or.left)),
                new Branch(exp, null, removeParenthesis(or.right))
        ));
    }

    private void implicationERule(Exp exp, ASTImplication imp) {
        addEdge("→E",removeParenthesis(imp.right), List.of(
                new Branch(removeParenthesis(imp.left), null, null),
                new Branch(exp, null, null)
        ));
    }

    private void conjunctionERule(Exp exp, ASTAnd and) {
        addEdge("∧Er",removeParenthesis(and.left), new Branch(exp, null, null));
        addEdge("∧El",removeParenthesis(and.right), new Branch(exp, null, null));
    }

    private void conjunctionIRule(Exp exp, ASTAnd and) {
        addEdge("∧I", exp, List.of(
                new Branch(removeParenthesis(and.left), null, null),
                new Branch(removeParenthesis(and.right), null, null)
        ));
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

        if (exp instanceof ASTImplication imp)
            implicationERule(exp, imp);
        else if (exp instanceof ASTAnd and) {
            conjunctionERule(exp, and);
            conjunctionIRule(exp, and);
        } else if (exp instanceof ASTOr or)
            disjunctionIRule(exp, or);
    }

    public List<Solution> solve(Exp exp, int solutionSize, int solutionsLimit) {
        List<Solution> solutions = new ArrayList<>();
        Queue<Solution> queue = new LinkedList<>();
        Set<State> states = new HashSet<>();

        queue.add(new Solution(exp));

        while (!queue.isEmpty()) {
            Solution solution = queue.poll();

            if (states.contains(solution.getCurrentState()))
                continue;
            states.add(solution.getCurrentState());

            if (solution.swapState())
                queue.add(solution);

            Exp current = solution.last();
            if (solution.size() >= solutionSize)
                continue;

            if (solution.isClosed()) {
                solutions.add(solution);

                if (solutions.size() == solutionsLimit)
                    break;
                continue;
            }

            State currentState = solution.getCurrentState();
            for (Edge edge : getAdjacentNodes(current, currentState))
                processNode(edge, solution, queue, states);

        }

        System.out.println(states.size());
        states.forEach(s->System.out.println(Utils.convertUnicodeEscapes(s.toString())));
        return solutions;
    }

    private List<Edge> getAdjacentNodes(Exp exp, State state) {
        List<Edge> edges = new ArrayList<>(graph.get(exp).stream().filter(e -> {
            for (Branch b : e.heads) {
                if (b.constraint != null && !state.hasHypothesis(b.constraint))
                    return false;
            }
            return true;
        }).toList());

        disjunctions.forEach(or -> edges.add(disjunctionERule(exp, or)));

        return edges;
    }

    private void processNode(Edge edge, Solution solution, Queue<Solution> queue, Set<State> states) {
        Branch first = edge.heads.get(0);
        Solution newSolution = solution.transit(first.to, edge);

        for (int i = 1; i < edge.heads.size(); i++) {
            Branch b = edge.heads.get(i);
            Solution nextSolution = solution.transit(b.to, edge);

            if (b.produces != null)
                nextSolution.getCurrentState().addHypothesis(b.produces);
            newSolution.addNextProof(nextSolution);

            //if (states.contains(nextSolution.getCurrentState()))
            //    return;
        }

        if (first.produces != null)
            newSolution.getCurrentState().addHypothesis(first.produces);

        //if (states.contains(newSolution.getCurrentState()))
        //    return;

        queue.add(newSolution);
    }

    @Override
    public String toString() {
        String str = "";
        str += "Total nodes: " + graph.size() + "\n";
        str += "Total edges: " + graph.values().stream().mapToInt(Set::size).sum() + "\n";
        str += "Disjunctions: " + disjunctions + "\n";
        for (Map.Entry<Exp, Set<Edge>> entry : graph.entrySet()) {
            str += entry.getKey() + ": \n";
            for (Edge edge : entry.getValue())
                str += "\t" + edge + "\n";
        }
        return str;
    }
}
