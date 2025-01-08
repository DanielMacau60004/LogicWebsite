package ast.horn;

import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;
import ast.types.ASTHornClause;
import ast.types.ASTHornClauses;
import symbols.Env;
import utils.Utils;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

public class HornClauses {

    private static Set<Exp> conjunctions(Exp exp, Set<Exp> exps) {
        if (exp instanceof ASTAnd conj) {
            conjunctions(conj.left, exps);
            conjunctions(conj.right, exps);
        } else if (exp instanceof ASTParenthesis par)
            conjunctions(par.exp, exps);
        else exps.add(exp);

        return exps;
    }


    private static Set<Exp> disjunctions(Exp exp, Set<Exp> exps) {
        if (exp instanceof ASTOr conj) {
            disjunctions(conj.left, exps);
            disjunctions(conj.right, exps);
        } else if (exp instanceof ASTParenthesis par)
            disjunctions(par.exp, exps);
        else exps.add(exp);

        return exps;
    }


    public static Map<String, Exp> interpret(Exp exp) {
        Map<String, Exp> operations = new LinkedHashMap<>();

        operations.put("IMPLICATIONS", exp = ImplicationFOLVisitor.interpret(exp));
        operations.put("NEGATIONS",  exp = NegationFOLVisitor.interpret(exp));
        operations.put("STANDARDIZE", exp = StandardizeFOLVisitor.interpret(exp));
        operations.put("PRENEX", exp = ReorderFOLVisitor.interpret(exp));
        operations.put("SKOLEM", exp = SkolemFOLVisitor.interpret(exp));
        operations.put("CNF", exp = CNFClausesVisitor.interpret(exp));

        ASTHornClauses clauses = new ASTHornClauses();
        conjunctions(exp, new HashSet<>()).forEach(e->clauses.addClause(new ASTHornClause(disjunctions(e, new HashSet<>()))));
        operations.put("CLAUSES", clauses);

        return operations;
    }

}
