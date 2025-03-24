package logic.interpreter;

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
import logic.values.Value;

public class FOLFreeInterpreter implements FOLVisitor<Boolean, Env<Value>> {
    
    private final Exp variable;
    
    FOLFreeInterpreter(Exp variable) {
        this.variable = variable;
    }
    
    public static Boolean isFree(Exp exp, Exp variable) {
        FOLFreeInterpreter interpreter = new FOLFreeInterpreter(variable);
        return exp.accept(interpreter, null);
    }
    
    @Override
    public Boolean visit(ASTDelPred e, Env<Value> env) {
        return null;
    }

    @Override
    public Boolean visit(ASTBool e, Env<Value> env) {
        return false;
    }

    @Override
    public Boolean visit(ASTConstant e, Env<Value> env) {
        return false;
    }

    @Override
    public Boolean visit(ASTVariable e, Env<Value> env) {
        return e.equals(variable);
    }

    @Override
    public Boolean visit(ASTLiteral e, Env<Value> env) {
        return true; //TODO is this true?
    }

    @Override
    public Boolean visit(ASTNot e, Env<Value> env) {
        return e.exp.accept(this, env);
    }

    @Override
    public Boolean visit(ASTAnd e, Env<Value> env) {
        return e.left.accept(this, env) || e.right.accept(this, env);
    }

    @Override
    public Boolean visit(ASTOr e, Env<Value> env) {
        return e.left.accept(this, env) || e.right.accept(this, env);
    }

    @Override
    public Boolean visit(ASTImplication e, Env<Value> env) {
        return e.left.accept(this, env) || e.right.accept(this, env);
    }

    @Override
    public Boolean visit(ASTBiconditional e, Env<Value> env) {
        return e.left.accept(this, env) || e.right.accept(this, env);
    }

    @Override
    public Boolean visit(ASTComp e, Env<Value> env) {
        return null;
    }

    @Override
    public Boolean visit(ASTPred e, Env<Value> env) {
        return e.terms.stream().anyMatch(t -> t.accept(this, env));
    }

    @Override
    public Boolean visit(ASTExistential e, Env<Value> env) {
        if(e.variable.equals(variable))
            return false;
        return e.exp.accept(this, env);
    }

    @Override
    public Boolean visit(ASTUniversal e, Env<Value> env) {
        if(e.variable.equals(variable))
            return false;
        return e.exp.accept(this, env);
    }

    @Override
    public Boolean visit(ASTParenthesis e, Env<Value> env) {
        return e.exp.accept(this, env);
    }

    @Override
    public Boolean visit(ASTSequence e, Env<Value> env) {
        return null;
    }

    @Override
    public Boolean visit(ASTFun e, Env<Value> env) {
        return e.terms.stream().anyMatch(t -> t.accept(this, env));
    }
}
