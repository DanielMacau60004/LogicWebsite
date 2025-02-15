package algorithm.implementation.newImp;

import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;
import utils.Utils;

import java.util.*;

public class TransitionGraph {

    private final Exp conclusion;
    private final Map<Exp, Set<TransitionEdge>> transitions;
    private final Set<ASTOr> disjunctions;

    public TransitionGraph(Exp conclusion) {
        this.conclusion = conclusion;
        transitions = new HashMap<>();
        disjunctions = new HashSet<>();

        addNode(ExpUtils.BOT);
        addNode(conclusion);

    }

    public Exp getConclusion() {
        return conclusion;
    }

    private void addNode(Exp node) {
        if(transitions.containsKey(node))
            return;

        transitions.put(node, new HashSet<>());
        if (!node.equals(conclusion) &&  node instanceof ASTOr or)
            disjunctions.add(or);

        genBottomUp(node);
        genTopDown(node);
    }

    private void addEdge(Exp from, TransitionEdge edge) {
        addNode(from);
        edge.getTransitions().forEach(t->addNode(t.to));
        transitions.get(from).add(edge);
    }

    private void absurdityRule(Exp exp) {
        if (exp.equals(ExpUtils.BOT))
            return;

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        addEdge(exp, new TransitionEdge(ERule.ELIM_NEGATION, ExpUtils.BOT, null, neg));
        addEdge(ExpUtils.BOT, new TransitionEdge(ERule.ABSURDITY, exp, neg, null));
    }

    private void implicationIRule(Exp exp, ASTImplication imp) {
        Exp right = ExpUtils.removeParenthesis(imp.right);
        Exp left = ExpUtils.removeParenthesis(imp.left);
        addEdge(exp, new TransitionEdge(ERule.INTRO_IMPLICATION, right, null, left));
    }

    private void negationIRule(Exp exp, ASTNot not) {
        Exp notNeg = ExpUtils.removeParenthesis(not.exp);
        addNode(notNeg);

        addEdge(exp, new TransitionEdge(ERule.ELIM_NEGATION, ExpUtils.BOT, null, notNeg));
        addEdge(ExpUtils.BOT, new TransitionEdge(ERule.INTRO_NEGATION, exp, notNeg, null));
    }

    private void disjunctionIRule(Exp exp, ASTOr or) {
        Exp right = ExpUtils.removeParenthesis(or.right);
        Exp left = ExpUtils.removeParenthesis(or.left);

        addEdge(exp, new TransitionEdge(ERule.INTRO_DISJUNCTION_RIGHT, left, null, null));
        addEdge(exp, new TransitionEdge(ERule.INTRO_DISJUNCTION_LEFT, right, null, null));
    }

    private TransitionEdge disjunctionERule(Exp exp, ASTOr or) {
        Exp orExp = ExpUtils.removeParenthesis(or);
        Exp right = ExpUtils.removeParenthesis(or.right);
        Exp left = ExpUtils.removeParenthesis(or.left);

        return new TransitionEdge(ERule.ELIM_DISJUNCTION)
                .addTransition(exp, null, left)
                .addTransition(exp, null, right)
                .addTransition(orExp, null, null);
    }

    private void implicationERule(Exp exp, ASTImplication imp) {
        Exp right = ExpUtils.removeParenthesis(imp.right);
        Exp left = ExpUtils.removeParenthesis(imp.left);

        addEdge(right, new TransitionEdge(ERule.ELIM_IMPLICATION)
                .addTransition(left, null, null)
                .addTransition(exp, null, null));
    }

    private void conjunctionERule(Exp exp, ASTAnd and) {
        Exp right = ExpUtils.removeParenthesis(and.right);
        Exp left = ExpUtils.removeParenthesis(and.left);

        addEdge(left, new TransitionEdge(ERule.ELIM_CONJUNCTION_LEFT, exp, null, null));
        addEdge(right, new TransitionEdge(ERule.ELIM_CONJUNCTION_RIGHT, exp, null, null));
    }

    private void conjunctionIRule(Exp exp, ASTAnd and) {
        Exp right = ExpUtils.removeParenthesis(and.right);
        Exp left = ExpUtils.removeParenthesis(and.left);

        addEdge(exp, new TransitionEdge(ERule.INTRO_CONJUNCTION)
                .addTransition(left, null, null)
                .addTransition(right, null, null)
        );
    }

    private void genBottomUp(Exp exp) {
        exp = ExpUtils.removeParenthesis(exp);
        absurdityRule(exp);

        if (exp instanceof ASTImplication imp)
            implicationIRule(exp, imp);
        else if (exp instanceof ASTNot not)
            negationIRule(exp, not);
    }

    private void genTopDown(Exp exp) {
        exp = ExpUtils.removeParenthesis(exp);

        if (exp instanceof ASTImplication imp)
            implicationERule(exp, imp);
        else if (exp instanceof ASTAnd and) {
            conjunctionERule(exp, and);
            conjunctionIRule(exp, and);
        } else if (exp instanceof ASTOr or)
            disjunctionIRule(exp, or);
    }

    public List<TransitionEdge> getEdges(StateNode state) {
        List<TransitionEdge> edges = new ArrayList<>(transitions.get(state.getExp()).stream()
                .filter(e -> e.canTransit(state)).toList());
        disjunctions.forEach(or -> {
            //if(state.hasHypothesis(getNode(or)))
                edges.add(disjunctionERule(state.getExp(), or));
        });
        return edges;
    }

    @Override
    public String toString() {
        String str = "";
        str += "Total nodes: " + transitions.size() + "\n";
        str += "Total edges: " + transitions.values().stream().mapToInt(Set::size).sum() + "\n";
        str += "Disjunctions: " + disjunctions + "\n";
        for (Map.Entry<Exp, Set<TransitionEdge>> entry : transitions.entrySet()) {
            str += entry.getKey()+":  \n";
            for (TransitionEdge transition : entry.getValue())
                str += "\t" + transition.toFormatString(this) + "\n";
        }
        return str;
    }
}
