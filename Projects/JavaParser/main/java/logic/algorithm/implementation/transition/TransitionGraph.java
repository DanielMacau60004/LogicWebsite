package logic.algorithm.implementation.transition;

import logic.algorithm.ERule;
import logic.algorithm.ExpUtils;
import logic.ast.Exp;
import logic.ast.logic.*;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.types.ASTTerm;
import logic.ast.types.ASTVariable;
import logic.interpreter.FOLFreeInterpreter;
import logic.interpreter.FOLReplaceVariables;
import logic.interpreter.FOLTermsInterpreter;
import logic.utils.Utils;

import java.util.*;

public class TransitionGraph {

    private final Exp conclusion;
    private final Map<Exp, Set<TransitionEdge>> transitions;
    private final Map<Exp, Boolean> explored;

    private final Set<ASTOr> disjunctions;
    private final Set<ASTExistential> existentials;
    private final Set<Exp> premisses;

    private final Set<ASTTerm> terms;

    public TransitionGraph(Exp conclusion, Set<Exp> premisses) {
        this.conclusion = conclusion;
        this.premisses = premisses;
        this.explored = new HashMap<>();

        transitions = new HashMap<>();
        disjunctions = new HashSet<>();
        existentials = new HashSet<>();

        terms = new HashSet<>();

        //TODO DO I NEED TO ADD A NEW VARIABLE FOR CASES WHERE THE QUANTIFIERS VARIABLES AREN'T ENOUGH?
        terms.addAll(FOLTermsInterpreter.getTerms(conclusion));
        premisses.forEach(p -> terms.addAll(FOLTermsInterpreter.getTerms(p)));
        //terms.add(new ASTVariable("z"));
        //terms.add(new ASTVariable("a"));
        //terms.add(new ASTVariable("b"));

        System.out.println("Terms: " + Utils.convertUnicodeEscapes(terms));

        //Add all nodes necessary to generate the sub nodes
        addNode(ExpUtils.BOT, true);
        addNode(conclusion, true);
        premisses.forEach(p -> addNode(p, true));

        //Add the disjunction and existential rules to each node
        transitions.forEach((e, ts) -> {
            ts.addAll(disjunctions.stream().map(or -> disjunctionERule(e, or)).toList());
            existentials.forEach(exi -> ts.addAll(existentialERule(e, exi)));
        });
    }

    public Exp getConclusion() {
        return conclusion;
    }

    public Set<Exp> getPremisses() {
        return premisses;
    }

    private void addNode(Exp node, boolean canGen) {
        if (explored.containsKey(node) && explored.get(node))
            return;

        explored.put(node, canGen);
        transitions.put(node, new HashSet<>());
        if (!node.equals(conclusion) && node instanceof ASTOr or)
            disjunctions.add(or);
        if (!node.equals(conclusion) && node instanceof ASTExistential exi)
            existentials.add(exi);

        if (canGen) {
            genBottomUp(node);
            genTopDown(node);
        }
    }

    private void addEdge(Exp from, TransitionEdge edge, boolean canGen) {
        addNode(from, true);
        edge.getTransitions().forEach(t -> addNode(t.getTo(), canGen));
        transitions.get(from).add(edge);
    }

    private void absurdityRule(Exp exp) {
        if (exp.equals(ExpUtils.BOT))
            return;

        Exp neg = ExpUtils.negate(exp);
        addEdge(exp, new TransitionEdge(ERule.ABSURDITY, ExpUtils.BOT, neg), true);

        addEdge(ExpUtils.BOT, new TransitionEdge(ERule.ELIM_NEGATION)
                        .addTransition(exp)
                        .addTransition(neg)
                , false);
    }

    private void implicationIRule(ASTImplication imp) {
        Exp right = ExpUtils.removeParenthesis(imp.right);
        Exp left = ExpUtils.removeParenthesis(imp.left);
        addEdge(imp, new TransitionEdge(ERule.INTRO_IMPLICATION, right, left), true);
    }

    private void negationIRule(ASTNot not) {
        Exp notNeg = ExpUtils.removeParenthesis(not.exp);

        addEdge(not, new TransitionEdge(ERule.INTRO_NEGATION, ExpUtils.BOT, notNeg), true);
        addEdge(ExpUtils.BOT, new TransitionEdge(ERule.ELIM_NEGATION)
                        .addTransition(not)
                        .addTransition(notNeg)
                , true);
    }

    private void disjunctionIRule(ASTOr or) {
        Exp right = ExpUtils.removeParenthesis(or.right);
        Exp left = ExpUtils.removeParenthesis(or.left);

        addEdge(or, new TransitionEdge(ERule.INTRO_DISJUNCTION_RIGHT, left), true);
        addEdge(or, new TransitionEdge(ERule.INTRO_DISJUNCTION_LEFT, right), true);
    }

    private TransitionEdge disjunctionERule(Exp exp, ASTOr or) {
        Exp orExp = ExpUtils.removeParenthesis(or);
        Exp right = ExpUtils.removeParenthesis(or.right);
        Exp left = ExpUtils.removeParenthesis(or.left);

        return new TransitionEdge(ERule.ELIM_DISJUNCTION)
                .addTransition(exp, left)
                .addTransition(exp, right)
                .addTransition(orExp);
    }

    private void implicationERule(ASTImplication imp) {
        Exp right = ExpUtils.removeParenthesis(imp.right);
        Exp left = ExpUtils.removeParenthesis(imp.left);

        addEdge(right, new TransitionEdge(ERule.ELIM_IMPLICATION)
                .addTransition(left)
                .addTransition(imp), true);
    }

    private void conjunctionERule(ASTAnd and) {
        Exp right = ExpUtils.removeParenthesis(and.right);
        Exp left = ExpUtils.removeParenthesis(and.left);

        addEdge(left, new TransitionEdge(ERule.ELIM_CONJUNCTION_RIGHT, and), true);
        addEdge(right, new TransitionEdge(ERule.ELIM_CONJUNCTION_LEFT, and), true);
    }

    private void conjunctionIRule(ASTAnd and) {
        Exp right = ExpUtils.removeParenthesis(and.right);
        Exp left = ExpUtils.removeParenthesis(and.left);

        addEdge(and, new TransitionEdge(ERule.INTRO_CONJUNCTION)
                        .addTransition(left)
                        .addTransition(right)
                , true);
    }

    private void biconditionalIRule(ASTBiconditional eq) {
        addEdge(eq, new TransitionEdge(ERule.INTRO_CONJUNCTION)
                        .addTransition(new ASTImplication(eq.right, eq.left))
                        .addTransition(new ASTImplication(eq.left, eq.right))
                , true);
    }

    private void biconditionalERule(ASTBiconditional eq) {
        addEdge(new ASTAnd(
                        new ASTParenthesis(new ASTImplication(eq.left, eq.right)),
                        new ASTParenthesis(new ASTImplication(eq.right, eq.left))),
                new TransitionEdge(ERule.INTRO_CONJUNCTION)
                        .addTransition(eq), true);
    }

    private void existentialIRuleOLD(ASTExistential exi) {
        Exp psi = ExpUtils.removeParenthesis(exi.exp);
        ASTVariable xVar = (ASTVariable) exi.variable;

        terms.forEach(t -> {
            ASTVariable tTerm = new ASTVariable(t.getName());
            Exp psiXT = FOLReplaceVariables.replace(psi, xVar, tTerm);

            if (//(!FOLReplaceVariables.replace(psiXT, tTerm, xVar).equals(psi))  ||
                    !FOLFreeInterpreter.isFree(psiXT, tTerm))
                return;

            addEdge(exi, new TransitionEdge(ERule.INTRO_EXISTENTIAL)
                    .addTransition(psiXT), true);
        });
    }

    private void universalERule(ASTUniversal uni) {
        Exp psi = ExpUtils.removeParenthesis(uni.exp);
        ASTVariable xVar = (ASTVariable) uni.variable;

        terms.forEach(t -> {
            ASTVariable tTerm = new ASTVariable(t.getName()); //Constant or Variable!
            Exp psiXT = FOLReplaceVariables.replace(psi, xVar, tTerm);

            if (//(!FOLReplaceVariables.replace(psiXT, tTerm, xVar).equals(psi))  ||
                    !FOLFreeInterpreter.isFree(psiXT, tTerm))
                return;

            addEdge(psiXT, new TransitionEdge(ERule.ELIM_UNIVERSAL)
                    .addTransition(uni), true);
        });
    }

    private void universalIRule(ASTUniversal uni) {
        Exp psi = ExpUtils.removeParenthesis(uni.exp);
        ASTVariable xVar = (ASTVariable) uni.variable;

        terms.forEach(y -> { //TODO Only for variable not all terms
            ASTVariable yVar = new ASTVariable(y.getName());
            Exp psiXY = FOLReplaceVariables.replace(psi, xVar, yVar);

            if (//!FOLReplaceVariables.replace(psiXY, yVar, xVar).equals(psi) ||
                    (!xVar.equals(yVar) && FOLFreeInterpreter.isFree(psi, yVar)))
                return;

            addEdge(uni, new TransitionEdge(ERule.INTRO_UNIVERSAL)
                    .addTransition(psiXY, null, yVar), true);
        });
    }

    private List<TransitionEdge> existentialERule(Exp exp, ASTExistential exi) {
        Exp psi = ExpUtils.removeParenthesis(exi.exp);
        ASTVariable xVar = (ASTVariable) exi.variable;

        List<TransitionEdge> edges = new ArrayList<>();
        for (ASTTerm t : terms) { //TODO Only for variable not all terms
            ASTVariable yVar = new ASTVariable(t.getName());
            Exp psiXY = FOLReplaceVariables.replace(psi, xVar, yVar);

            if (//(!FOLReplaceVariables.replace(psiXY, yVar, xVar).equals(psi))  ||
                    (!xVar.equals(t) && FOLFreeInterpreter.isFree(psi, yVar))
                    || FOLFreeInterpreter.isFree(exp, yVar))
                continue;

            edges.add(new TransitionEdge(ERule.ELIM_EXISTENTIAL)
                    .addTransition(exi)
                    .addTransition(exp, psiXY, yVar));
        }

        return edges;
    }

    //Rules that generate hypotheses
    private void genBottomUp(Exp exp) {
        exp = ExpUtils.removeParenthesis(exp);
        absurdityRule(exp);
        //existentialIRule(exp);

        if (exp instanceof ASTImplication imp)
            implicationIRule(imp);
        else if (exp instanceof ASTNot not)
            negationIRule(not);
        //else if (exp instanceof ASTExistential exi)
            //existentialERule(exp, exi);
    }

    //Rules that don't generate hypotheses
    private void genTopDown(Exp exp) {
        exp = ExpUtils.removeParenthesis(exp);

        if (exp instanceof ASTImplication imp)
            implicationERule(imp);
        else if (exp instanceof ASTAnd and) {
            conjunctionERule(and);
            conjunctionIRule(and);
        } else if (exp instanceof ASTOr or)
            disjunctionIRule(or);
            //TODO we dont want to allow <->
        /*else if(exp instanceof ASTBiconditional eq) {
            biconditionalIRule(exp, eq);
            biconditionalERule(exp, eq);
        }*/
        else if (exp instanceof ASTUniversal uni) {
            universalERule(uni);
            universalIRule(uni);
        } else if (exp instanceof ASTExistential exi)
            existentialIRuleOLD(exi);
    }

    public Set<TransitionEdge> getEdges(Exp exp) {
        return transitions.get(exp);
    }

    @Override
    public String toString() {
        String str = "";
        str += "Total nodes: " + transitions.size() + "\n";
        str += "Total edges: " + transitions.values().stream().mapToInt(Set::size).sum() + "\n";
        str += "Disjunctions: " + disjunctions + "\n";
        str += "Existentials: " + existentials + "\n";
        for (Map.Entry<Exp, Set<TransitionEdge>> entry : transitions.entrySet()) {
            str += entry.getKey() + ":  \n";
            for (TransitionEdge transition : entry.getValue())
                str += "\t" + transition + "\n";
        }
        return str;
    }
}
