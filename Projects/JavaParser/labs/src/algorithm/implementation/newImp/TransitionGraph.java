package algorithm.implementation;

import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;
import utils.Utils;

import java.util.*;

public class TransitionGraph {

    private final Map<Integer, Exp> exps;
    private final Map<Exp, Integer> ids;
    private final Map<Integer, Set<TransitionEdge>> transitions;
    private final Set<ASTOr> disjunctions;

    public TransitionGraph(Exp exp) {
        exps = new HashMap<>();
        ids = new HashMap<>();
        transitions = new HashMap<>();
        disjunctions = new HashSet<>();

        addNode(ExpUtils.BOT, false);
        addNode(exp, true);
    }

    private int computeNodeId(Exp exp) {
        Integer id = ids.get(ExpUtils.invert(exp));

        if (id != null)
            return -id;

        return (ExpUtils.isNegated(exp) ? -exps.size() : exps.size()) + 1;
    }

    protected Exp getExp(Integer id) {
        return exps.get(id);
    }

    protected Integer getNode(Exp node) {
        return ids.get(node);
    }

    private int addNode(Exp node, boolean propagate) {
        node = ExpUtils.removeParenthesis(node);
        Integer id = getNode(node);

        if (id != null)
            return id;

        id = computeNodeId(node);
        exps.put(id, node);
        ids.put(node, id);
        transitions.put(id, new HashSet<>());

        if (node instanceof ASTOr or)
            disjunctions.add(or);

        if(propagate) {
            genBottomUp(node);
            genTopDown(node);
        }

        return id;
    }

    private void addEdge(int idLeft, TransitionEdge edge) {
        transitions.get(idLeft).add(edge);
    }

    private void absurdityRule(Exp exp) {
        System.out.println(Utils.convertUnicodeEscapes(exp+""));
        if (exp.equals(ExpUtils.BOT))
            return;

        Exp neg = new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
        int expId = addNode(exp, true);
        int idNeg = addNode(neg, false);
        int idBot = getNode(ExpUtils.BOT);

        addEdge(expId, new TransitionEdge(ERule.ELIM_NEGATION, idBot, null, idNeg));
        addEdge(idBot, new TransitionEdge(ERule.ABSURDITY, expId, idNeg, null));
    }

    private void implicationIRule(Exp exp, ASTImplication imp) {
        int expId = addNode(exp, true);
        int leftId = addNode(imp.left, true);
        int rightId = addNode(imp.right, true);
        addEdge(expId, new TransitionEdge(ERule.INTRO_IMPLICATION, rightId, null, leftId));
    }

    private void negationIRule(Exp exp, ASTNot not) {
        int expId = addNode(exp, true);
        int notNegId = addNode(not.exp, true);
        int idBot = getNode(ExpUtils.BOT);
        addEdge(expId, new TransitionEdge(ERule.ELIM_NEGATION, idBot, null, notNegId));
        addEdge(idBot, new TransitionEdge(ERule.INTRO_NEGATION, expId, notNegId, null));
    }

    private void disjunctionIRule(Exp exp, ASTOr or) {
        int expId = addNode(exp, true);
        int leftId = addNode(or.left, true);
        int rightId = addNode(or.right, true);

        addEdge(expId, new TransitionEdge(ERule.INTRO_DISJUNCTION_RIGHT, leftId, null, null));
        addEdge(expId, new TransitionEdge(ERule.INTRO_DISJUNCTION_LEFT, rightId, null, null));
    }

    private TransitionEdge disjunctionERule(Exp exp, ASTOr or) {
        int expId = addNode(exp, true);
        int orId = addNode(or, true);
        int leftId = addNode(or.left, true);
        int rightId = addNode(or.right, true);

        return new TransitionEdge(ERule.ELIM_DISJUNCTION)
                .addTransition(orId, null, null)
                .addTransition(expId, null, leftId)
                .addTransition(expId, null, rightId);
    }

    private void implicationERule(Exp exp, ASTImplication imp) {
        int expId = addNode(exp, true);
        int leftId = addNode(imp.left, true);
        int rightId = addNode(imp.right, true);

        addEdge(rightId, new TransitionEdge(ERule.ELIM_IMPLICATION)
                .addTransition(leftId, null, null)
                .addTransition(expId, null, null));
    }

    private void conjunctionERule(Exp exp, ASTAnd and) {
        int expId = addNode(exp, true);
        int leftId = addNode(and.left, true);
        int rightId = addNode(and.right, true);

        addEdge(leftId, new TransitionEdge(ERule.ELIM_CONJUNCTION_LEFT, expId, null, null));
        addEdge(rightId, new TransitionEdge(ERule.ELIM_CONJUNCTION_RIGHT, expId, null, null));
    }

    private void conjunctionIRule(Exp exp, ASTAnd and) {
        int expId = addNode(exp, true);
        int leftId = addNode(and.left, true);
        int rightId = addNode(and.right, true);
        addEdge(expId, new TransitionEdge(ERule.INTRO_CONJUNCTION)
                .addTransition(leftId, null, null)
                .addTransition(rightId, null, null)
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

    @Override
    public String toString() {
        String str = "";
        str += "Total nodes: " + exps.size() + "\n";
        str += "Total edges: " + transitions.values().stream().mapToInt(Set::size).sum() + "\n";
        str += "Disjunctions: " + disjunctions + "\n";
        for (Map.Entry<Integer, Set<TransitionEdge>> entry : transitions.entrySet()) {
            str += String.format("%-4s|%s: \n", entry.getKey(), getExp(entry.getKey()));
            for (TransitionEdge transition : entry.getValue())
                str += "\t" + transition.toFormatString(this) + "\n";
        }
        return str;
    }
}
