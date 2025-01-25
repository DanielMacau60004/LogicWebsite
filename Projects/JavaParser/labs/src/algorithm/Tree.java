package algorithm;

import ast.Exp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Tree {

    Exp expr;
    Exp hypothesis;
    HashMap<Exp, Tree> nodes;
    Tree parent;
    int level = 0;

    public Tree(Exp expr, Exp hypothesis) {
        this.expr = expr;
        this.hypothesis = hypothesis;
        this.nodes = new HashMap<>();
    }

    public void addBranch(Tree node) {
        nodes.put(node.expr, node);
    }

    public Tree subTree(Exp expr, Exp hypothesis) {
        Tree tree = new Tree(expr, hypothesis);
        tree.parent = this;
        tree.level = level + 1;
        addBranch(tree);
        return tree;
    }

    public List<List<Exp>> getAllPaths() {
        List<List<Exp>> allPaths = new ArrayList<>();
        List<Exp> currentPath = new ArrayList<>();
        collectPaths(this, currentPath, allPaths);
        return allPaths;
    }

    private void collectPaths(Tree node, List<Exp> currentPath, List<List<Exp>> allPaths) {
        currentPath.add(node.expr);

        if (node.nodes.isEmpty())
            allPaths.add(new ArrayList<>(currentPath));
        else {
            for (Tree child : node.nodes.values())
                collectPaths(child, currentPath, allPaths);
        }

        currentPath.remove(currentPath.size() - 1);
    }

    public List<List<List<Exp>>> combinePaths(List<List<Exp>> paths, int maxLength) {
        List<List<List<Exp>>> validCombinations = new ArrayList<>();

        int n = paths.size();

        // Generate all combinations of paths
        for (int i = 0; i < (1 << n); i++) {
            List<List<Exp>> combination = new ArrayList<>();
            int totalElements = 0;

            for (int j = 0; j < n; j++) {
                if ((i & (1 << j)) != 0) {
                    List<Exp> path = paths.get(j);
                    combination.add(path);
                    totalElements += path.size();
                }
            }

            // Add the combination if it doesn't exceed maxLength
            if (totalElements <= maxLength) {
                validCombinations.add(combination);
            }
        }

        return validCombinations;
    }

    @Override
    public String toString() {
        String str = "\t".repeat(level);

        str += expr.toString();
        if (hypothesis != null)
            str += " [" + hypothesis + "]";

        str += "\n";
        for (Tree t : nodes.values())
            str += t.toString();

        return str;
    }
}

