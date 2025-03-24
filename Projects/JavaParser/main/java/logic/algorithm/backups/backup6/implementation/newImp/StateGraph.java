package logic.algorithm.backups.backup6.implementation.newImp;


import java.util.*;

public class StateGraph {

    //Necessario para garantir que os as refs dos nos sao sempre as mesmas
    private final Map<StateNode, StateNode> nodes;
    private final Map<StateNode, Set<StateEdge>> graph;
    private final Map<StateNode, Set<StateEdge>> inverted;

    private final Set<StateNode> closed = new HashSet<>();
    public final TransitionGraph transitionGraph;

    public StateGraph(TransitionGraph transitionGraph, int heightLimit, int nodesLimit) {
        this.nodes = new HashMap<>();
        this.graph = new HashMap<>();
        this.inverted = new HashMap<>();
        this.transitionGraph = transitionGraph;

        build(heightLimit, nodesLimit);
        trim();
    }

    private void build(int heightLimit, int nodesLimit) {
        Queue<StateNode> explore = new LinkedList<>();

        explore.add(new StateNode(transitionGraph.getConclusion(), new HashSet<>(), 0));
        while (!explore.isEmpty()) {
            StateNode state = explore.poll();
            if (graph.containsKey(state)) continue;

            if (state.getHeight() > heightLimit || closed.size() == nodesLimit) break;

            Set<StateEdge> edges = new HashSet<>();
            graph.put(state, edges);

            if (state.isClosed()) closed.add(state);
            else {
                for (TransitionEdge edge : transitionGraph.getEdges(state)) {

                    StateEdge e = new StateEdge(edge.getRule(), state);
                    for (Transition transition : edge.getTransitions()) {
                        StateNode newState = state.transit(transition.to, transition.produces);
                        if (nodes.containsKey(newState)) newState = nodes.get(newState);
                        else nodes.put(newState, newState);

                        e.addTransition(newState);

                        inverted.putIfAbsent(newState, new HashSet<>());
                        inverted.get(newState).add(new StateEdge(edge.getRule(), newState, state));
                        explore.add(newState);
                    }
                    edges.add(e);
                }
            }
        }

        System.out.println("[Before]:\n" + this);
    }

    public boolean isSolvable() {
        StateNode node = new StateNode(transitionGraph.getConclusion(), new HashSet<>(), 0);
        return graph.containsKey(node);
    }

    private void trim() {
        Set<StateNode> explored = new HashSet<>();
        Queue<StateNode> explore = new LinkedList<>(closed);

        while (!explore.isEmpty()) {
            StateNode state = explore.poll();
            state.setClosed();

            if (explored.contains(state)) continue;
            explored.add(state);

            if (inverted.get(state) != null) {
                for (StateEdge prev : inverted.get(state)) {
                    for (StateNode to : prev.getTransitions()) {
                        if (graph.get(to) != null && graph.get(to).stream().anyMatch(StateEdge::isClosed)) {
                            explore.add(to);
                        }
                    }
                }
            }
        }

        //Clear extraNodes
        explored.forEach(n -> graph.get(n).removeIf(t -> {
            boolean shouldRemove = !t.isClosed();

            //Remove direct loops
            if (!shouldRemove) {
                shouldRemove = t.getTransitions().stream().anyMatch(s -> s.equals(n));
            }

            return shouldRemove;
        }));
        graph.keySet().removeIf(n -> {
            n.resetOpen();
            return !explored.contains(n);
        });

        System.out.println("[After]\n" + this);
    }

    public List<Solution> findSolutions(int limit, Set<ERule> forbiddenRules) {
        return findSolutions(limit, new StateNode(transitionGraph.getConclusion(), new HashSet<>(), 0), forbiddenRules);
    }

    public List<Solution> findSolutions(int limit, StateNode initState, Set<ERule> forbiddenRules) {
        List<Solution> solutions = new ArrayList<>();
        if (!isSolvable()) return solutions;

        Map<StateNode, Integer> explored = new HashMap<>();
        //Set<StateEdge> explored = new HashSet<>();
        Queue<Solution> explore = new LinkedList<>();

        explore.add(new Solution(initState));

        int size = 0;
        int clones = 0;

        while (!explore.isEmpty()) {size++;
            Solution solution = explore.poll();
            Map.Entry<Integer, StateNode> noden = solution.popHead();

            if (noden == null) {
                solutions.add(solution);

                if (solutions.size() >= limit) break;
                continue;
            }

            StateNode node = noden.getValue();
            Integer i = explored.get(node);
            if(i == null || node.getHeight()<i) explored.put(node, node.getHeight());
            else continue;

            Set<StateEdge> edges = graph.get(node);
            for (StateEdge edge : edges) {
                if (forbiddenRules.contains(edge.getRule())) continue;
                //if (explored.contains(edge)) continue;
                //explored.add(edge);
                Solution sol = edges.size() == 1 ? solution : solution.clone();
                if(edges.size() > 1)clones++;

                for (StateNode tran : edge.getTransitions())
                    sol.subSolution(tran);
                explore.add(sol);
            }
        }

        System.out.println("SIZE: " +size);
        System.out.println("CLONES: " +clones);
        return solutions;
    }

    @Override
    public String toString() {
        String str = "";
        str += "Total nodes: " + graph.size() + "\n";
        str += "Total edges: " + graph.values().stream().mapToInt(Set::size).sum() + "\n";
        str += "Closed: " + closed.size() + "\n";
        for (Map.Entry<StateNode, Set<StateEdge>> entry : graph.entrySet()) {
            //str += transitionGraph.getExp(entry.getKey().getExp()) + " hypotheses:" + entry.getKey()+
            //        " edges:"+ entry.getValue() + ": \n";
        }
        return str;
    }

}
