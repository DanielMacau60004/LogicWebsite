package logic.ast.horn;

import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.logic.*;
import logic.ast.symbols.ASTDelPred;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.ast.types.ASTBool;
import logic.ast.types.ASTConstant;
import logic.ast.types.ASTPred;
import logic.ast.types.ASTVariable;
import logic.symbols.Env;

import java.util.*;

public class CNFClausesVisitor implements FOLVisitor<Exp, Env<Exp>> {

    @Override
    public Exp visit(ASTDelPred e, Env<Exp> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTBool e, Env<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTConstant e, Env<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTVariable e, Env<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTLiteral e, Env<Exp> env) {
        return null;
    }

    @Override
    public Exp visit(ASTNot e, Env<Exp> env) {
        return new ASTNot(e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTAnd e, Env<Exp> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTAnd(left, right);
    }

    private Set<Exp> conjunctions(Exp exp, Set<Exp> exps) {
        if (exp instanceof ASTAnd conj) {
            conjunctions(conj.left, exps);
            conjunctions(conj.right, exps);
        } else if (exp instanceof ASTParenthesis par)
            conjunctions(par.exp, exps);
        else exps.add(exp);

        return exps;
    }

    @Override
    public Exp visit(ASTOr e, Env<Exp> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        Set<Exp> leftExps = conjunctions(left, new HashSet<>());
        Set<Exp> rightExps = conjunctions(right, new HashSet<>());

        Exp exp = null;
        for (Exp l : leftExps) {
            for (Exp r : rightExps) {
                Exp newExp = new ASTParenthesis(new ASTOr(l, r));
                if (exp == null) exp = newExp;
                else exp = new ASTAnd(exp, newExp);

            }
        }

        return exp != null ? exp : new ASTAnd(left, right);
    }

    @Override
    public Exp visit(ASTImplication e, Env<Exp> env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTBiconditional e, Env<Exp> env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTComp e, Env<Exp> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTPred e, Env<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTExistential e, Env<Exp> env) {
        throw new RuntimeException("It only works with expressions with no quantifiers!");
    }

    @Override
    public Exp visit(ASTUniversal e, Env<Exp> env) {
        throw new RuntimeException("It only works with expressions with no quantifiers!");
    }

    @Override
    public Exp visit(ASTParenthesis e, Env<Exp> env) {
        return e.exp.accept(this, env);
    }

    @Override
    public Exp visit(ASTSequence e, Env<Exp> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTFun astFun, Env<Exp> env) {
        return null;
    }

    public static Exp interpret(Exp exp) {
        Env<Exp> env = new Env<>();
        CNFClausesVisitor visitor = new CNFClausesVisitor();
        exp = exp.accept(visitor, env);

        return exp;
    }

}
