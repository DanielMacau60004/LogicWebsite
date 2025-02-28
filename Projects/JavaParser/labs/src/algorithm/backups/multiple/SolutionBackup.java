package algorithm.backups.multiple;

import algorithm.backups.multiple.state.StateNode;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Stack;

public class SolutionBackup {

    private int depth = 0;
    private Map.Entry<Integer, StateNode> node;
    private final List<Map.Entry<Integer, StateNode>> path;
    private final Stack<Map.Entry<Integer, StateNode>> open;

    public SolutionBackup(StateNode node) {
        this(new LinkedList<>(), new Stack<>());
        open.push(Map.entry(0, node));
    }

    SolutionBackup(LinkedList<Map.Entry<Integer, StateNode>> path,
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

    public SolutionBackup clone() {
        SolutionBackup sol = new SolutionBackup(new LinkedList<>(path), (Stack<Map.Entry<Integer, StateNode>>) open.clone());
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
