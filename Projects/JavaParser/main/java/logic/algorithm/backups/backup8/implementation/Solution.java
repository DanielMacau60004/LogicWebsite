package logic.algorithm.backups.backup8.implementation;

import logic.algorithm.ERule;
import logic.algorithm.backups.backup8.implementation.state.StateNode;

import java.util.ArrayList;
import java.util.List;

public class Solution {

    private final StateNode node;
    private final ERule rule;
    private final List<Solution> children;

    public Solution(StateNode node, ERule rule) {
        this.node = node;
        this.rule = rule;
        children = new ArrayList<>();
    }

    public void addChild(Solution solution) {
        children.add(solution);
    }

    public int depth() {
        if (children.isEmpty())
            return 1;

        int maxChildDepth = 0;
        for (Solution child : children)
            maxChildDepth = Math.max(maxChildDepth, child.depth());

        return 1 + maxChildDepth;
    }

    public int size() {
        int totalSize = 1;

        for (Solution child : children)
            totalSize += child.size();
        return totalSize;
    }

    @Override
    public String toString() {
        return toStringHelper(0);
    }

    private String toStringHelper(int level) {
        StringBuilder sb = new StringBuilder();
        sb.append("\t".repeat(level));

        sb.append(node).append(" (").append(rule).append(")\n");
        for (Solution child : children)
            sb.append(child.toStringHelper(level + 1));

        return sb.toString();
    }
}
