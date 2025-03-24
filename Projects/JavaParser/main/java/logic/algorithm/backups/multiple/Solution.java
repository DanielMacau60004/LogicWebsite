package logic.algorithm.backups.multiple;

import logic.algorithm.backups.multiple.state.StateNode;

import java.util.*;

public class Solution {

    private int depth = 0;
    private Map.Entry<Integer, StateNode> node;
    private final List<Map.Entry<Integer, StateNode>> path;
    private Stack<Map.Entry<Integer, StateNode>> open;

    public Solution(StateNode node) {
        this(new LinkedList<>(), new Stack<>());
        open.push(Map.entry(0, node));
    }

    Solution(LinkedList<Map.Entry<Integer, StateNode>> path,
                   Stack<Map.Entry<Integer, StateNode>> open) {
        this.path = path;
        this.open = open;
    }

    public int depth() {
        return depth;
    }

    public int size() {
        return path.size();
    }

    public void subSolution(StateNode newNode) {
        open.add(Map.entry(node.getKey() + 1, newNode));
    }

    public Map.Entry<Integer, StateNode> popHead() {
        if (open.isEmpty())
            return null;
        node = open.pop();

        path.add(node);
        depth = Math.max(depth, node.getKey());

        if (node.getValue().isClosed())
            return popHead();
        return node;
    }

    public Solution clone() {
        Solution sol = new Solution(new LinkedList<>(path), (Stack<Map.Entry<Integer, StateNode>>) open.clone());
        sol.node = node;
        return sol;
    }

    @Override
    public String toString() {
        String str = "";
        for (Map.Entry<Integer, StateNode> p : path)
            str += "\t".repeat(p.getKey()) + p.getValue() + " [" + null+ "]\n";
        return str;
    }
}
