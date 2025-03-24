package logic.interpreter;

import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.logic.*;
import logic.ast.symbols.ASTDelPred;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.ast.types.*;

public class FOLReplaceVariables implements FOLVisitor<Exp, Void> {

    private final ASTTerm oldVariable;
    private final ASTTerm newVariable;

    FOLReplaceVariables(ASTTerm oldVariable, ASTTerm newVariable) {
        this.oldVariable = oldVariable;
        this.newVariable = newVariable;
    }

    public static Exp replace(Exp exp, ASTTerm oldVariable, ASTTerm newVariable) {
        return exp.accept(new FOLReplaceVariables(oldVariable, newVariable), null);
    }

    @Override
    public Exp visit(ASTDelPred e, Void env) {
        return null;
    }

    @Override
    public Exp visit(ASTBool e, Void env) {
        return e;
    }

    @Override
    public Exp visit(ASTConstant e, Void env) {
        return e.equals(oldVariable) ? newVariable : e;
    }

    @Override
    public Exp visit(ASTVariable e, Void env) {
        return e.equals(oldVariable) ? newVariable : e;
    }

    @Override
    public Exp visit(ASTLiteral e, Void env) {
        return e;
    }

    @Override
    public Exp visit(ASTNot e, Void env) {
        return new ASTNot(e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTAnd e, Void env) {
        return new ASTAnd(e.left.accept(this, env), e.right.accept(this, env));
    }

    @Override
    public Exp visit(ASTOr e, Void env) {
        return new ASTOr(e.left.accept(this, env), e.right.accept(this, env));
    }

    @Override
    public Exp visit(ASTImplication e, Void env) {
        return new ASTImplication(e.left.accept(this, env), e.right.accept(this, env));
    }

    @Override
    public Exp visit(ASTBiconditional e, Void env) {
        return new ASTBiconditional(e.left.accept(this, env), e.right.accept(this, env));
    }

    @Override
    public Exp visit(ASTComp e, Void env) {
        return null;
    }

    @Override
    public Exp visit(ASTPred e, Void env) {
        return new ASTPred(e.predicate, e.terms.stream().map(t -> t.accept(this, env)).toList());
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
        return new ASTParenthesis(e.exp.accept(this, env));
    }

    @Override
    public Exp visit(ASTSequence e, Void env) {
        return null;
    }

    @Override
    public Exp visit(ASTFun e, Void env) {
        return e.equals(oldVariable) ? newVariable :
                new ASTPred(e.fun, e.terms.stream().map(t -> t.accept(this, env)).toList());
    }
}
