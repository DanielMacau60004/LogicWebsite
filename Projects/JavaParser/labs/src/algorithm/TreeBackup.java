package algorithm;

import ast.Exp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TreeBackup {

    Exp expr;
    Exp hypothesis;
    HashMap<Exp, TreeBackup> nodes;
    TreeBackup parent;
    int level = 0;

    public TreeBackup(Exp expr, Exp hypothesis) {
        this.expr = expr;
        this.hypothesis = hypothesis;
        this.nodes = new HashMap<>();
    }

    public void addBranch(TreeBackup node) {
        nodes.put(node.expr, node);
    }

    public TreeBackup subTree(Exp expr, Exp hypothesis) {
        TreeBackup tree = new TreeBackup(expr, hypothesis);
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

    private void collectPaths(TreeBackup node, List<Exp> currentPath, List<List<Exp>> allPaths) {
        currentPath.add(node.expr);

        if (node.nodes.isEmpty()) {
            allPaths.add(new ArrayList<>(currentPath));
        } else {
            for (TreeBackup child : node.nodes.values()) {
                collectPaths(child, currentPath, allPaths);
            }
        }

        currentPath.remove(currentPath.size() - 1);
    }

    public List<List<List<Exp>>> combinePathsConsideringOrderOptimized(List<List<Exp>> paths, int maxLength) {
        List<List<List<Exp>>> validCombinations = new ArrayList<>();

        // Generate all subsets of paths
        int n = paths.size();
        for (int subsetMask = 1; subsetMask < (1 << n); subsetMask++) {
            List<List<Exp>> subset = new ArrayList<>();
            int totalElementsInSubset = 0;

            // Build subset based on the bitmask
            for (int i = 0; i < n; i++) {
                if ((subsetMask & (1 << i)) != 0) {
                    List<Exp> path = paths.get(i);
                    totalElementsInSubset += path.size();
                    if (totalElementsInSubset > maxLength) {
                        break; // Stop building the subset if it exceeds the limit
                    }
                    subset.add(path);
                }
            }

            // Skip subsets that exceed the max length
            if (totalElementsInSubset > maxLength) {
                continue;
            }

            // Generate permutations for the current subset
            List<List<List<Exp>>> permutations = new ArrayList<>();
            permuteSubsetOptimized(subset, new ArrayList<>(), new boolean[subset.size()], permutations, maxLength, 0);

            // Add valid permutations to the final result
            validCombinations.addAll(permutations);
        }

        return validCombinations;
    }

    private void permuteSubsetOptimized(
            List<List<Exp>> subset,
            List<List<Exp>> currentPermutation,
            boolean[] used,
            List<List<List<Exp>>> permutations,
            int maxLength,
            int currentTotal) {

        // If the current permutation's total exceeds maxLength, stop further exploration
        if (currentTotal > maxLength) {
            return;
        }

        // If all items in the subset are used, add the current permutation
        if (currentPermutation.size() == subset.size()) {
            permutations.add(new ArrayList<>(currentPermutation));
            return;
        }

        // Generate permutations by recursively selecting unused items
        for (int i = 0; i < subset.size(); i++) {
            if (!used[i]) {
                List<Exp> path = subset.get(i);
                int pathSize = path.size();

                // Mark path as used
                used[i] = true;
                currentPermutation.add(path);

                // Recursively generate further permutations
                permuteSubsetOptimized(subset, currentPermutation, used, permutations, maxLength, currentTotal + pathSize);

                // Backtrack
                used[i] = false;
                currentPermutation.remove(currentPermutation.size() - 1);
            }
        }
    }

    @Override
    public String toString() {
        String str = "\t".repeat(level);

        str += expr.toString();
        if (hypothesis != null)
            str += " [" + hypothesis + "]";

        str += "\n";
        for (TreeBackup t : nodes.values())
            str += t.toString();

        return str;
    }
}

