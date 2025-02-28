package algorithm.implementation.state;

import algorithm.implementation.transition.TransitionEdge;
import algorithm.implementation.transition.TransitionGraph;
import algorithm.implementation.transition.TransitionNode;

import java.util.*;
import java.util.concurrent.*;

public class ParallelStateGraph extends StateGraph {

    private static final int MAX_BATCH = 5000;

    public ParallelStateGraph(TransitionGraph transitionGraph, int heightLimit, int nodesLimit) {
        super(transitionGraph, heightLimit, nodesLimit);
    }

    @Override
    void build(TransitionGraph transitionGraph, int heightLimit, int nodesLimit) {
        graph = new ConcurrentHashMap<>();
        nodes = new ConcurrentHashMap<>();

        Queue<StateNode> closed = new ConcurrentLinkedQueue<>();
        Queue<StateNode> explore = new ConcurrentLinkedQueue<>();
        ConcurrentMap<StateNode, Set<StateEdge>> inverted = new ConcurrentHashMap<>();

        explore.add(getInitState());

        ForkJoinPool pool = new ForkJoinPool(); // Uses all available CPU cores

        while (!explore.isEmpty()) {
            List<StateNode> batch = new ArrayList<>();

            for (int i = 0; i < MAX_BATCH; i++) {
                StateNode node = explore.poll();
                if (node == null) break;
                batch.add(node);
            }

            pool.submit(() ->
                    batch.parallelStream().forEach(state ->
                            processNode(state, transitionGraph, heightLimit, nodesLimit, closed, explore, inverted)
                    )
            ).join();
        }

        System.out.println("[Before]:\n" + this);
        trim(closed, inverted);
    }

    private void processNode(StateNode state, TransitionGraph transitionGraph, int heightLimit, int nodesLimit,
                             Queue<StateNode> closed, Queue<StateNode> explore, ConcurrentMap<StateNode, Set<StateEdge>> inverted) {

        if (graph.containsKey(state) || state.getHeight() > heightLimit || closed.size() >= nodesLimit) return;

        Set<StateEdge> edges = ConcurrentHashMap.newKeySet();
        Set<StateEdge> existingEdges = graph.putIfAbsent(state, edges);

        if (existingEdges != null)
            return;

        if (state.isClosed()) {
            closed.add(state);
            return;
        }

        for (TransitionEdge edge : transitionGraph.getEdges(state.getExp())) {
            StateEdge e = new StateEdge(edge.getRule());

            for (TransitionNode transition : edge.getTransitions()) {
                StateNode newState = state.transit(transition.getTo(), transition.getProduces());

                StateNode existingState = nodes.putIfAbsent(newState, newState);
                if (existingState != null)
                    newState = existingState;

                e.addTransition(newState);

                inverted.computeIfAbsent(newState, k -> ConcurrentHashMap.newKeySet())
                        .add(new StateEdge(edge.getRule(), state));
                explore.add(newState);
            }

            edges.add(e);
        }
    }
}
