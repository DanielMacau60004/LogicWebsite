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

public class SkolemFOLVisitor implements FOLVisitor<Exp, Env<Exp>> {

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
        return env.find(e.getName());
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

    @Override
    public Exp visit(ASTOr e, Env<Exp> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTOr(left, right);
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
        return new ASTPred(e.predicate, e.terms.stream().map(t->t.accept(this, env)).toList());
    }

    @Override
    public Exp visit(ASTExistential e, Env<Exp> env) {
        env = env.beginScope();
        env.bind(e.variable.toString(),new ASTFun(e.variable.toString(),
                env.list().stream().filter(f->!(f instanceof ASTFun)).toList())); //Is it true?
        Exp exp = e.exp.accept(this, env);
        env.endScope();
        return exp;
    }

    @Override
    public Exp visit(ASTUniversal e, Env<Exp> env) {
        env = env.beginScope();
        env.bind(e.variable.toString(),e.variable);
        Exp exp = e.exp.accept(this, env);
        env.endScope();
        return exp;
    }

    @Override
    public Exp visit(ASTParenthesis e, Env<Exp> env) {
        return new ASTParenthesis(e.exp.accept(this,env));
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
        SkolemFOLVisitor visitor = new SkolemFOLVisitor();
        exp = exp.accept(visitor,env);

        return exp;
    }

}
