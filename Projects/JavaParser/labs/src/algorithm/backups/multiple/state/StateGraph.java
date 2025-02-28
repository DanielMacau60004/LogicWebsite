package algorithm.backups.multiple.state;


import algorithm.ERule;
import algorithm.backups.multiple.Solution;
import algorithm.backups.multiple.transition.TransitionEdge;
import algorithm.backups.multiple.transition.TransitionGraph;
import algorithm.backups.multiple.transition.TransitionNode;
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
                        if(state == to) continue;

                        Set<StateEdge> edges = graph.get(to);
                        if (edges != null) {
                            List<StateEdge> eList = edges.stream()
                                    .filter(t-> t.isClosed() && t.getTransitions().stream().noneMatch(s->s.equals(to)))
                                    .toList();

                            if(!eList.isEmpty()) {
                                explore.add(to);
                                Set<StateEdge> edgesSet = newGraph.computeIfAbsent(to, k -> new HashSet<>());
                                edgesSet.addAll(eList);
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

    public List<Solution> findSolutions(int limit) {
        if (!isSolvable())
            return null;

        return findSolutionsAux(limit, getInitState(), new HashSet<>());
    }

    public List<Solution> findSolutions(int limit, Set<ERule> forbiddenRules) {
        if (!isSolvable())
            return null;

        return findSolutionsAux(limit, getInitState(), forbiddenRules);
    }

    public List<Solution> findSolutions(int limit, Exp exp, Set<Exp> hypotheses) {
        if (!isSolvable())
            return null;

        return findSolutionsAux(limit, new StateNode(exp, hypotheses), new HashSet<>());
    }

    public List<Solution> findSolutions(int limit, Exp exp, Set<Exp> hypotheses, Set<ERule> forbiddenRules) {
        if (!isSolvable())
            return null;

        return findSolutionsAux(limit, new StateNode(exp, hypotheses), forbiddenRules);
    }


    /*private List<Solution> findSolutionsMagicAux(int limit, StateNode initState, Set<ERule> forbiddenRules) {

        Queue<StateNode> explore = new LinkedList<>();
        explore.add(initState);

        Map<StateNode, List<StateNode>> storedPaths = new HashMap<>();

        while (!explore.isEmpty()) {
            StateNode current = explore.poll();

            Set<StateEdge> edges = graph.get(node);
            for (StateEdge edge : edges) {
                if (forbiddenRules.contains(edge.getRule())) continue;
            }
        }
    }
*/

    private List<Solution> findSolutionsAux(int limit, StateNode initState, Set<ERule> forbiddenRules) {
        List<Solution> solutions = new ArrayList<>();

        Map<StateNode, Integer> explored = new HashMap<>();
        Queue<Solution> explore = new LinkedList<>();
        explore.add(new Solution(initState));

        int size = 0;
        int clones = 0;

        while (!explore.isEmpty()) {
            size++;
            Solution solution = explore.poll();
            Map.Entry<Integer, StateNode> noden = solution.popHead();

            if (noden == null) {
                solutions.add(solution);

                if (solutions.size() >= limit) break;
                continue;
            }

            StateNode node = noden.getValue();
            Integer i = explored.get(node);
            if (i == null || node.getHeight() <= i) explored.put(node, node.getHeight());
            else continue;

            Set<StateEdge> edges = graph.get(node);

            for (StateEdge edge : edges) {
                if (forbiddenRules.contains(edge.getRule())) continue;

                Solution sol = edges.size() == 1 ? solution : solution.clone();
                if (edges.size() > 1) clones++;

                for (StateNode tran : edge.getTransitions()) {
                    sol.subSolution(tran);
                    //tran.rule = edge.getRule();
                }
                explore.add(sol);
            }

        }

        System.out.println("SIZE: " + size);
        System.out.println("CLONES: " + clones);
        return solutions;
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
