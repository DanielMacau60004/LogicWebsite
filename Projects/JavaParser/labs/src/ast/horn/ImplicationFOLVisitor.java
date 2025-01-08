package ast.horn;

import ast.Exp;
import ast.FOLVisitor;
import ast.logic.*;
import ast.symbols.ASTDelPred;
import ast.symbols.ASTParenthesis;
import ast.symbols.ASTSequence;
import ast.types.ASTBool;
import ast.types.ASTConstant;
import ast.types.ASTPred;
import ast.types.ASTVariable;
import symbols.Env;

public class ImplicationFOLVisitor implements FOLVisitor<Exp, Void> {

    @Override
    public Exp visit(ASTDelPred e, Void env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTBool e, Void env) {
        return e;
    }

    @Override
    public Exp visit(ASTConstant e, Void env) {
        return e;
    }

    @Override
    public Exp visit(ASTVariable e, Void env) {
        return e;
    }

    @Override
    public Exp visit(ASTNot e, Void env) {
        return new ASTNot(e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTAnd e, Void env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTAnd(left, right);
    }

    @Override
    public Exp visit(ASTOr e, Void env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTOr(left, right);
    }

    @Override
    public Exp visit(ASTImplication e, Void env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTOr(new ASTNot(left), right);
    }

    @Override
    public Exp visit(ASTEquivalence e, Void env) {
        Exp left = e.left.accept(this, env);
        Exp right = e.right.accept(this, env);

        return new ASTAnd(
                new ASTParenthesis(new ASTOr(new ASTNot(left), right)),
                new ASTParenthesis(new ASTOr(left, new ASTNot(right))));
    }

    @Override
    public Exp visit(ASTComp e, Void env) {
        throw new RuntimeException("It only works with single expressions!");
    }

    @Override
    public Exp visit(ASTPred e, Void env) {
        return e;
    }

    @Override
    public Exp visit(ASTExistential e, Void env) {
        return new ASTExistential(e.variable, e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTUniversal e, Void env) {
        return new ASTUniversal(e.variable, e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTParenthesis e, Void env) {
        return new ASTParenthesis(e.exp.accept(this,env));
    }

    @Override
    public Exp visit(ASTSequence e, Void env) {
        throw new RuntimeException("It only works with single expressions!");
    }


    public static Exp interpret(Exp exp) {
        ImplicationFOLVisitor visitor = new ImplicationFOLVisitor();
        exp = exp.accept(visitor,null);

        return exp;
    }
}
