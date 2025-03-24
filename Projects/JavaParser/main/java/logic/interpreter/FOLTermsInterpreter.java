package logic.interpreter;

import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.logic.*;
import logic.ast.symbols.ASTDelPred;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.ast.types.*;
import logic.symbols.Env;
import logic.values.Value;

import java.util.HashSet;
import java.util.Set;

public class FOLTermsInterpreter implements FOLVisitor<Void, Env<Value>> {

    private final Set<ASTTerm> terms;

    FOLTermsInterpreter() {
        this.terms = new HashSet<>();
    }

    public static Set<ASTTerm> getTerms(Exp exp) {
        FOLTermsInterpreter interpreter = new FOLTermsInterpreter();
        exp.accept(interpreter, null);

        return interpreter.terms;
    }

    @Override
    public Void visit(ASTDelPred e, Env<Value> env) {
        return null;
    }

    @Override
    public Void visit(ASTBool e, Env<Value> env) {
        return null;
    }

    @Override
    public Void visit(ASTConstant e, Env<Value> env) {
        terms.add(e);
        return null;
    }

    @Override
    public Void visit(ASTVariable e, Env<Value> env) {
        terms.add(e);
        return null;
    }

    @Override
    public Void visit(ASTLiteral e, Env<Value> env) {
        return null;
    }

    @Override
    public Void visit(ASTNot e, Env<Value> env) {
        e.exp.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTAnd e, Env<Value> env) {
        e.left.accept(this, env);
        e.right.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTOr e, Env<Value> env) {
        e.left.accept(this, env);
        e.right.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTImplication e, Env<Value> env) {
        e.left.accept(this, env);
        e.right.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTBiconditional e, Env<Value> env) {
        e.left.accept(this, env);
        e.right.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTComp e, Env<Value> env) {
        return null;
    }

    @Override
    public Void visit(ASTPred e, Env<Value> env) {
        e.terms.forEach(t -> t.accept(this, env));
        return null;
    }

    @Override
    public Void visit(ASTExistential e, Env<Value> env) {
        e.variable.accept(this, env);
        e.exp.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTUniversal e, Env<Value> env) {
        e.variable.accept(this, env);
        e.exp.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTParenthesis e, Env<Value> env) {
        e.exp.accept(this, env);
        return null;
    }

    @Override
    public Void visit(ASTSequence e, Env<Value> env) {
        return null;
    }

    @Override
    public Void visit(ASTFun e, Env<Value> env) {
        terms.add(e);
        e.terms.forEach(t -> t.accept(this, env));
        return null;
    }
}
