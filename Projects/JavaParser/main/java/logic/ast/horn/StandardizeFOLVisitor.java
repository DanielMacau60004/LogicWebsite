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

public class StandardizeFOLVisitor implements FOLVisitor<Exp, Env<ASTVariable>> {

    private int index = 0;

    @Override
    public Exp visit(ASTDelPred e, Env<ASTVariable> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTBool e, Env<ASTVariable> env) {
        return e;
    }

    @Override
    public Exp visit(ASTConstant e, Env<ASTVariable> env) {
        return e;
    }

    @Override
    public Exp visit(ASTVariable e, Env<ASTVariable> env) {
        return env.find(e.getName());
    }

    @Override
    public Exp visit(ASTLiteral e, Env<ASTVariable> env) {
        return null;
    }

    @Override
    public Exp visit(ASTNot e, Env<ASTVariable> env) {
        return new ASTNot(e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTAnd e, Env<ASTVariable> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTAnd(left, right);
    }

    @Override
    public Exp visit(ASTOr e, Env<ASTVariable> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTOr(left, right);
    }

    @Override
    public Exp visit(ASTImplication e, Env<ASTVariable> env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTBiconditional e, Env<ASTVariable> env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTComp e, Env<ASTVariable> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTPred e, Env<ASTVariable> env) {
        return new ASTPred(e.predicate, e.terms.stream().map(t->t.accept(this, env)).toList());
    }

    @Override
    public Exp visit(ASTExistential e, Env<ASTVariable> env) {
        env = env.beginScope();
        ASTVariable variable = new ASTVariable(Character.toString(('a'+ index++)));
        env.bind(e.variable.toString(), variable);
        Exp exp = e.exp.accept(this, env);
        env.endScope();
        return new ASTExistential(variable, exp);
    }

    @Override
    public Exp visit(ASTUniversal e, Env<ASTVariable> env) {
        env = env.beginScope();
        ASTVariable variable = new ASTVariable(Character.toString(('a'+ index++)));
        env.bind(e.variable.toString(), variable);
        Exp exp = e.exp.accept(this, env);
        env.endScope();
        return new ASTUniversal(variable, exp);
    }

    @Override
    public Exp visit(ASTParenthesis e, Env<ASTVariable> env) {
        return new ASTParenthesis(e.exp.accept(this,env));
    }

    @Override
    public Exp visit(ASTSequence e, Env<ASTVariable> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTFun astFun, Env<ASTVariable> env) {
        return null;
    }

    public static Exp interpret(Exp exp) {
        Env<ASTVariable> env = new Env<>();
        StandardizeFOLVisitor visitor = new StandardizeFOLVisitor();
        exp = exp.accept(visitor,env);

        return exp;
    }
}
