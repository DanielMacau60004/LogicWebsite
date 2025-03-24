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

public class NegationFOLVisitor implements FOLVisitor<Exp, Boolean> {

    @Override
    public Exp visit(ASTDelPred e, Boolean env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTBool e, Boolean env) {
        return env ? new ASTNot(e) : e;
    }

    @Override
    public Exp visit(ASTConstant e, Boolean env) {
        return e;
    }

    @Override
    public Exp visit(ASTVariable e, Boolean env) {
        return e;
    }

    @Override
    public Exp visit(ASTLiteral e, Boolean env) {
        return null;
    }

    @Override
    public Exp visit(ASTNot e, Boolean env) {
        return e.exp.accept(this, !env);
    }

    @Override
    public Exp visit(ASTAnd e, Boolean env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return env ? new ASTOr(left, right) : new ASTAnd(left, right);
    }

    @Override
    public Exp visit(ASTOr e, Boolean env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return env ? new ASTAnd(left, right) : new ASTOr(left, right);
    }

    @Override
    public Exp visit(ASTImplication e, Boolean env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTBiconditional e, Boolean env) {
        throw new RuntimeException("It only works with single with no equivalences!");
    }

    @Override
    public Exp visit(ASTComp e, Boolean env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTPred e, Boolean env) {
        return env ? new ASTNot(e) : e;
    }

    @Override
    public Exp visit(ASTExistential e, Boolean env) {
        Exp exp = e.exp.accept(this, env);
        return env ? new ASTUniversal(e.variable, exp) : new ASTExistential(e.variable, exp);
    }

    @Override
    public Exp visit(ASTUniversal e, Boolean env) {
        Exp exp = e.exp.accept(this, env);
        return env ? new ASTExistential(e.variable, exp) : new ASTUniversal(e.variable, exp);
    }

    @Override
    public Exp visit(ASTParenthesis e, Boolean env) {
        return new ASTParenthesis(e.exp.accept(this,env));
    }

    @Override
    public Exp visit(ASTSequence e, Boolean env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTFun astFun, Boolean env) {
        return null;
    }

    public static Exp interpret(Exp exp) {
        NegationFOLVisitor visitor = new NegationFOLVisitor();
        exp = exp.accept(visitor,false);

        return exp;
    }
}
