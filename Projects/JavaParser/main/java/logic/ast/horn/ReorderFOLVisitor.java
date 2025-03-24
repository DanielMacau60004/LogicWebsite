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

import java.util.Stack;

public class ReorderFOLVisitor implements FOLVisitor<Exp, Stack<Exp>> {

    @Override
    public Exp visit(ASTDelPred e, Stack<Exp> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTBool e, Stack<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTConstant e, Stack<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTVariable e, Stack<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTLiteral e, Stack<Exp> env) {
        return null;
    }

    @Override
    public Exp visit(ASTNot e, Stack<Exp> env) {
        return new ASTNot(e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTAnd e, Stack<Exp> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTAnd(left, right);
    }

    @Override
    public Exp visit(ASTOr e, Stack<Exp> env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTOr(left, right);
    }

    @Override
    public Exp visit(ASTImplication e, Stack<Exp> env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTBiconditional e, Stack<Exp> env) {
        throw new RuntimeException("It only works with expressions with no equivalences!");
    }

    @Override
    public Exp visit(ASTComp e, Stack<Exp> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTPred e, Stack<Exp> env) {
        return e;
    }

    @Override
    public Exp visit(ASTExistential e, Stack<Exp> env) {
        env.add(e);
        return e.exp.accept(this, env);
    }

    @Override
    public Exp visit(ASTUniversal e, Stack<Exp> env) {
        env.add(e);
        return e.exp.accept(this, env);
    }

    @Override
    public Exp visit(ASTParenthesis e, Stack<Exp> env) {
        return new ASTParenthesis(e.exp.accept(this,env));
    }

    @Override
    public Exp visit(ASTSequence e, Stack<Exp> env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTFun astFun, Stack<Exp> env) {
        return null;
    }

    public static Exp interpret(Exp exp) {
        Stack<Exp> env = new Stack<>();
        ReorderFOLVisitor visitor = new ReorderFOLVisitor();
        exp = exp.accept(visitor,env);

        while(!env.isEmpty()) {
            Exp temp  = env.pop();

            if(temp instanceof ASTUniversal uni) exp = new ASTUniversal(uni.variable, exp);
            else if(temp instanceof ASTExistential uni) exp = new ASTExistential(uni.variable, exp);
        }

        return exp;
    }

}
