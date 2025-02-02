package algorithm;

import ast.Exp;
import ast.logic.ASTAnd;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;

import java.util.*;

public class Graph<T, C> {

    Map<T, Set<Edge<T, C>>> graph;

    static class Edge<T, C> {
        T to;
        C constraint;
        C produces;

        Edge(T to, C constraint, C produces) {
            this.to = to;
            this.constraint = constraint;
            this.produces = produces;
        }

        @Override
        public String toString() {
            return to + " requires[" + constraint + "], produces[" + produces + "]";
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Edge<?, ?> edge = (Edge<?, ?>) o;
            return Objects.equals(to, edge.to) && Objects.equals(constraint, edge.constraint) && Objects.equals(produces, edge.produces);
        }

        @Override
        public int hashCode() {
            return Objects.hash(to, constraint, produces);
        }
    }

    public Graph() {
        graph = new HashMap<>();
    }

    public void addEdge(T a, T b, C constraint, C produces) {
        graph.putIfAbsent(a, new HashSet<>());
        graph.get(a).add(new Edge<>(b, constraint, produces));
    }

    public List<List<T>> findSolutions(T start, int maxDepth, int botLimit, List<C> premisses) {
        List<List<T>> solutions = new ArrayList<>();
        List<T> currentPath = new ArrayList<>();
        List<C> constraints = new LinkedList<>(premisses);

        find(start, maxDepth, botLimit, currentPath, solutions, constraints);

        return solutions;
    }

    //TODO alterar para procura em largura (assim sabemos quais sao as solucoes mais curtas)
    private void find(T node, int maxDepth, int botLimit, List<T> currentPath, List<List<T>> solutions,
                      List<C> constraints) {
        // Add the current node to the path
        constraints.add(null);
        currentPath.add(node);

        // Stop further recursion if the depth limit is reached
        if (currentPath.size() >= maxDepth || currentPath.stream()
                .filter(t -> Test.BOT.equals(t)).count() > botLimit) {
            currentPath.remove(currentPath.size() - 1); // Backtrack
            constraints.remove(constraints.size() - 1);
            return;
        }

        // Explore all neighbors
        for (Edge<T, C> neighbor : graph.get(node)) {
            // Avoid revisiting the immediate predecessor (consecutive loop)
            // TODO check if has the required thing to visit the node!
            if (currentPath.size() > 1 && neighbor == currentPath.get(currentPath.size() - 2))
                continue; // Skip consecutive loops

            if (!constraints.contains(neighbor.constraint))
                continue;

            //Can close hypothesis
            constraints.add(neighbor.produces);

            if (constraints.contains(neighbor.to)) {
                List<T> solution = new ArrayList<>(currentPath);
                solution.add(neighbor.to);
                solutions.add(solution);
            } else if (neighbor.produces != null && containsNegation(constraints)) {
                List<T> solution = new ArrayList<>(currentPath);
                solution.add((T) Test.BOT);
                solutions.add(solution);
            } else {
                find(neighbor.to, maxDepth, botLimit, currentPath, solutions, constraints);
            }
            constraints.remove(constraints.size() - 1);
        }

        //TODO it will generate a lot of combinations!
        if (node instanceof ASTAnd and) {
            List<List<T>> solutionsLeft = findSolutions((T) Test.removeParenthesis(and.left),
                    maxDepth - currentPath.size(), botLimit, new ArrayList<>());
            if (!solutionsLeft.isEmpty()) {
                List<List<T>> solutionsRight = findSolutions((T) Test.removeParenthesis(and.right),
                        maxDepth - currentPath.size(), botLimit, constraints);
                if (!solutionsRight.isEmpty()) {
                    List<T> solution = new ArrayList<>(currentPath);
                    solution.add((T) new ASTLiteral("∧"));
                }
            }
        }


        // Backtrack: Remove the current node from the path
        currentPath.remove(currentPath.size() - 1);
        constraints.remove(constraints.size() - 1);
    }

    public boolean containsNegation(List<C> constraints) {
        List<C> n = constraints.stream().filter(Objects::nonNull).toList();
        List<C> negs = constraints.stream().filter(t -> t instanceof ASTNot).toList();

        for (C neg : negs) {
            if (neg instanceof ASTNot nn) {
                if (nn.exp instanceof ASTParenthesis p) neg = (C) p.e;
                else neg = (C) nn.exp;
            } else
                neg = (C) new ASTNot(new ASTParenthesis((Exp) neg));

            if (n.contains(neg)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        String str = "";
        for (Map.Entry<T, Set<Edge<T, C>>> entry : graph.entrySet()) {
            str += entry.getKey() + ": \n";
            for (Edge<T, C> edge : entry.getValue())
                str += "\t" + edge + "]\n";
        }
        return str;
    }


}
