package algorithm.implementation.state;

import algorithm.ERule;
import algorithm.implementation.Solution;
import algorithm.implementation.transition.TransitionEdge;
import algorithm.implementation.transition.TransitionGraph;
import algorithm.implementation.transition.TransitionNode;
import ast.Exp;

import java.util.*;

public class StateGraph {

    //Necessary to keep the refs of the nodes
    protected Map<StateNode, StateNode> nodes;
    protected Map<StateNode, Set<StateEdge>> graph;

    private final Exp conclusion;
    private final Set<Exp> premisses;

    public StateGraph(TransitionGraph transitionGraph, int heightLimit, int nodesLimit) {
        this.nodes = new HashMap<>();
        this.graph = new HashMap<>();

        this.conclusion = transitionGraph.getConclusion();
        this.premisses = transitionGraph.getPremisses();

        build(transitionGraph, heightLimit, nodesLimit);
    }

    StateNode getInitState() {
        return new StateNode(conclusion, premisses);
    }

    void build(TransitionGraph transitionGraph, int heightLimit, int nodesLimit) {
        Queue<StateNode> closed = new LinkedList<>();
        Queue<StateNode> explore = new LinkedList<>();
        Map<StateNode, Set<StateEdge>> inverted = new HashMap<>();

        explore.add(getInitState());

        while (!explore.isEmpty()) {
            StateNode state = explore.poll();

            if (graph.containsKey(state))
                continue;
            if (state.getHeight() > heightLimit || closed.size() == nodesLimit)
                break;

            Set<StateEdge> edges = new HashSet<>();
            graph.put(state, edges);

            if (state.isClosed()) {
                closed.add(state);
                continue;
            }

            for (TransitionEdge edge : transitionGraph.getEdges(state.getExp())) {
                StateEdge e = new StateEdge(edge.getRule());
                for (TransitionNode transition : edge.getTransitions()) {
                    StateNode newState = state.transit(transition.getTo(), transition.getProduces());

                    StateNode finalNewState = newState;
                    newState = nodes.computeIfAbsent(newState, k -> finalNewState);

                    e.addTransition(newState);

                    inverted.computeIfAbsent(newState, k -> new HashSet<>())
                            .add(new StateEdge(edge.getRule(), state));

                    explore.add(newState);
                }

                edges.add(e);
            }
        }

        System.out.println("[Before]:\n" + this);
        trim(closed, inverted);
    }

    void trim(Queue<StateNode> explore, Map<StateNode, Set<StateEdge>> inverted) {
        Set<StateNode> explored = new HashSet<>();
        Map<StateNode, Set<StateEdge>> newGraph = new HashMap<>();

        while (!explore.isEmpty()) {
            StateNode state = explore.poll();
            newGraph.putIfAbsent(state, new HashSet<>());
            state.setClosed();

            if (explored.contains(state)) continue;
            explored.add(state);

            if (inverted.get(state) != null) {
                for (StateEdge prev : inverted.get(state)) {
                    for (StateNode to : prev.getTransitions()) {
                        Set<StateEdge> edges = graph.get(to);
                        if (edges != null) {

                            Optional<StateEdge> e = edges.stream().filter(StateEdge::isClosed).findFirst();
                            if (e.isPresent()) {
                                explore.add(to);

                                Set<StateEdge> edgesSet = newGraph.computeIfAbsent(to, k -> new HashSet<>());
                                edgesSet.add(e.get());
                                graph.put(to, edgesSet);
                            }
                        }
                    }
                }
            }
        }

        graph = newGraph;
        explored.forEach(StateNode::resetClose);

        System.out.println("[After]\n" + this);
    }

    public boolean isSolvable() {
        return graph.containsKey(getInitState());
    }

    public Solution findSolutions() {
        if (!isSolvable())
            return null;

        return findSolutionsAux(getInitState(), null);
    }

    public Solution findSolutions(Exp exp, Set<Exp> hypotheses) {
        if (!isSolvable())
            return null;

        return findSolutionsAux(new StateNode(exp, hypotheses), null);
    }

    private Solution findSolutionsAux(StateNode initState, ERule rule) {
        Set<StateEdge> edges = graph.get(initState);

        if (edges == null)
            return null;

        Solution solution = new Solution(initState, rule);

        for (StateEdge edge : edges)
            for (StateNode node : edge.getTransitions()) {
                Solution newSolution = findSolutionsAux(node, edge.getRule());
                if(newSolution != null)
                    solution.addChild(newSolution);
            }

        return solution;
    }

    @Override
    public String toString() {
        String str = "";
        str += "Total nodes: " + graph.size() + "\n";
        str += "Total edges: " + graph.values().stream().mapToInt(Set::size).sum() + "\n";
        for (Map.Entry<StateNode, Set<StateEdge>> entry : graph.entrySet()) {
            //str += transitionGraph.getExp(entry.getKey().getExp()) + " hypotheses:" + entry.getKey()+
            //        " edges:"+ entry.getValue() + ": \n";
        }
        return str;
    }

}
