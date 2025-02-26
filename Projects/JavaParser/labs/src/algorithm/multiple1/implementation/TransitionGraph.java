package algorithm.multiple1.implementation;

import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;

import java.util.*;

public class TransitionGraph {

    private final Exp conclusion;
    private final Map<Exp, Set<TransitionEdge>> transitions;
    private final Set<ASTOr> disjunctions;
    final Set<Exp> premisses;

    public TransitionGraph(Exp conclusion, Set<Exp> premisses) {
        this.conclusion = conclusion;
        transitions = new HashMap<>();
        disjunctions = new HashSet<>();

        addNode(ExpUtils.BOT, true);
        addNode(conclusion, true);
        premisses.forEach(p -> addNode(p, true));

        this.premisses = premisses;
    }

    public Exp getConclusion() {
        return conclusion;
    }

    private void addNode(Exp node, boolean canGen) {
        if (transitions.containsKey(node))
            return;

        transitions.put(node, new HashSet<>());
        if (!node.equals(conclusion) && node instanceof ASTOr or)
            disjunctions.add(or);

        if (canGen) {
            genBottomUp(node);
            genTopDown(node);
        }
    }

    private void addEdge(Exp from, TransitionEdge edge, boolean canGen) {
        addNode(from, true);
        edge.getTransitions().forEach(t -> addNode(t.to, canGen));
        transitions.get(from).add(edge);
    }

    private void absurdityRule(Exp exp) {
        if (exp.equals(ExpUtils.BOT))
            return;

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        addEdge(exp, new TransitionEdge(ERule.ELIM_NEGATION, ExpUtils.BOT, neg, false), true);

        addEdge(ExpUtils.BOT, new TransitionEdge(ERule.ABSURDITY)
                        .addTransition(exp)
                        .addTransition(neg)
                , false);
    }

    private void implicationIRule(Exp exp, ASTImplication imp) {
        Exp right = ExpUtils.removeParenthesis(imp.right);
        Exp left = ExpUtils.removeParenthesis(imp.left);
        addEdge(exp, new TransitionEdge(ERule.INTRO_IMPLICATION, right, left, false), true);
    }

    private void negationIRule(Exp exp, ASTNot not) {
        Exp notNeg = ExpUtils.removeParenthesis(not.exp);

        addEdge(exp, new TransitionEdge(ERule.INTRO_NEGATION, ExpUtils.BOT, notNeg, true), true);
        addEdge(ExpUtils.BOT, new TransitionEdge(ERule.ABSURDITY)
                        .addTransition(exp)
                        .addTransition(notNeg)
                , true);
    }

    private void disjunctionIRule(Exp exp, ASTOr or) {
        Exp right = ExpUtils.removeParenthesis(or.right);
        Exp left = ExpUtils.removeParenthesis(or.left);

        addEdge(exp, new TransitionEdge(ERule.INTRO_DISJUNCTION_RIGHT, left), true);
        addEdge(exp, new TransitionEdge(ERule.INTRO_DISJUNCTION_LEFT, right), true);
    }

    private TransitionEdge disjunctionERule(Exp exp, ASTOr or) {
        Exp orExp = ExpUtils.removeParenthesis(or);
        Exp right = ExpUtils.removeParenthesis(or.right);
        Exp left = ExpUtils.removeParenthesis(or.left);

        return new TransitionEdge(ERule.ELIM_DISJUNCTION)
                .addTransition(exp, left, true)
                .addTransition(exp, right, true)
                .addTransition(orExp);
    }

    private void implicationERule(Exp exp, ASTImplication imp) {
        Exp right = ExpUtils.removeParenthesis(imp.right);
        Exp left = ExpUtils.removeParenthesis(imp.left);

        addEdge(right, new TransitionEdge(ERule.ELIM_IMPLICATION)
                .addTransition(left)
                .addTransition(exp), true);
    }

    private void conjunctionERule(Exp exp, ASTAnd and) {
        Exp right = ExpUtils.removeParenthesis(and.right);
        Exp left = ExpUtils.removeParenthesis(and.left);

        addEdge(left, new TransitionEdge(ERule.ELIM_CONJUNCTION_LEFT, exp), true);
        addEdge(right, new TransitionEdge(ERule.ELIM_CONJUNCTION_RIGHT, exp), true);
    }

    private void conjunctionIRule(Exp exp, ASTAnd and) {
        Exp right = ExpUtils.removeParenthesis(and.right);
        Exp left = ExpUtils.removeParenthesis(and.left);

        addEdge(exp, new TransitionEdge(ERule.INTRO_CONJUNCTION)
                        .addTransition(left)
                        .addTransition(right)
                , true);
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
        List<TransitionEdge> edges = new ArrayList<>(transitions.get(state.getExp()));
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
            str += entry.getKey() + ":  \n";
            for (TransitionEdge transition : entry.getValue())
                str += "\t" + transition.toFormatString(this) + "\n";
        }
        return str;
    }
}
