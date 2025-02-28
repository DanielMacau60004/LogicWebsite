package interpreter;

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
import values.Value;

public class FOLInterpreter implements FOLVisitor<Value, Env<Value>> {

    @Override
    public Value visit(ASTDelPred e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTBool e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTConstant e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTVariable e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTNot e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTAnd e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTOr e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTImplication e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTBiconditional e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTComp e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTPred e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTExistential e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTUniversal e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTParenthesis e, Env<Value> env) {
        return null;
    }

    @Override
    public Value visit(ASTSequence e, Env<Value> env) {
        return null;
    }

    public static Value interpret(Exp e) {
        FOLInterpreter i = new FOLInterpreter();
        Env<Value> env = new Env<>();
        return e.accept(i, env);
    }

}
