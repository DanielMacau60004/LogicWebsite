package algorithm.implementation;

import java.util.ArrayList;
import java.util.List;

import static algorithm.implementation.Tests.SubtreeExtractor.extractAllSubtrees;

public class Tests {


    public static void main(String[] args) {
        TreeNode root = new TreeNode(1);
        root.children.add(new TreeNode(2));
        root.children.add(new TreeNode(3));
        root.children.get(0).children.add(new TreeNode(4));
        root.children.get(0).children.add(new TreeNode(5));

        List<List<Integer>> result = extractAllSubtrees(root);

        // Print all extracted subtrees
        for (List<Integer> subtree : result) {
            System.out.println(subtree);
        }
    }


    public static class TreeNode {
        int val;
        List<TreeNode> children;

        TreeNode(int val) {
            this.val = val;
            this.children = new ArrayList<>();
        }
    }

    public class SubtreeExtractor {

        // List to store all extracted subtrees
        static List<List<Integer>> allSubtrees = new ArrayList<>();

        public static List<List<Integer>> extractAllSubtrees(TreeNode root) {
            if (root == null) return allSubtrees;
            dfs(root);
            return allSubtrees;
        }

        private static List<Integer> dfs(TreeNode node) {
            if (node == null) return new ArrayList<>();

            // Collect all nodes in this subtree
            List<Integer> subtree = new ArrayList<>();
            subtree.add(node.val);

            for (TreeNode child : node.children) {
                List<Integer> childSubtree = dfs(child);
                subtree.addAll(childSubtree);
            }

            // Store the extracted subtree
            allSubtrees.add(new ArrayList<>(subtree));
            return subtree;
        }


    }

}
