package typechecker;

import ast.*;
import ast.logic.*;
import ast.types.ASTBool;
import ast.logic.ASTLiteral;
import symbols.Env;
import types.*;

public class TypeChecker implements Exp.Visitor<Type, Env<Type>> {

    public static ErrorHandler errorHandler;

    @Override
    public Type visit(ASTAnd e, Env<Type> env) {
        Type t1 = e.e1.accept(this, env);
        Type t2 = e.e2.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .build();
    }

    @Override
    public Type visit(ASTEquivalence e, Env<Type> env) {
        Type t1 = e.e1.accept(this, env);
        Type t2 = e.e2.accept(this, env);

        //TODO
        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(BoolType.singleton))
                .build();
    }

    @Override
    public Type visit(ASTNot e, Env<Type> env) {
        Type t = e.e.accept(this, env);

        return new TypeBuilder(e, t)
                .addFunction(new Header(TableType.singleton).ret(TableType.singleton))
                .build();
    }

    @Override
    public Type visit(ASTOr e, Env<Type> env) {
        Type t1 = e.e1.accept(this, env);
        Type t2 = e.e2.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .build();
    }

    @Override
    public Type visit(ASTBool e, Env<Type> env)
    {
        e.setType(BoolType.singleton);
        return BoolType.singleton;
    }

    @Override
    public Type visit(ASTDiff e, Env<Type> env) {
        Type t1 = e.e1.accept(this, env);
        Type t2 = e.e2.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(BoolType.singleton))
                .build();
    }

    @Override
    public Type visit(ASTLiteral e, Env<Type> env) {
        return TableType.singleton;
    }

    @Override
    public Type visit(ASTImplication e, Env<Type> env) {
        Type t1 = e.e1.accept(this, env);
        Type t2 = e.e2.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .build();
    }

    @Override
    public Type visit(ASTSequence e, Env<Type> env) {
        Type type = null;
        for (Exp exp : e.sequence)
            type = exp.accept(this, env);

        e.setType(type);
        return type;
    }

    @Override
    public Type visit(ASTKnowledgeBase e, Env<Type> env) {
        for(Exp exp : e.e)
            exp.accept(this,env);
        return KnowledgeBaseType.singleton;
    }

    @Override
    public Type visit(ASTModels e, Env<Type> env) {
        Type t1 = e.kb.accept(this, env);
        Type t2 = e.e.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(KnowledgeBaseType.singleton, TableType.singleton).ret(ProofType.singleton))
                .build();
    }

    public static Type checker(Exp e) throws TypeCheckerError {
        errorHandler = new ErrorHandler();
        TypeChecker i = new TypeChecker();
        Env<Type> env = new Env<>();
        Type type = e.accept(i, env);
        e.setType(type);
        if(errorHandler.hasErrors())
            throw new TypeCheckerError(errorHandler.getErrors());
        return type;
    }

}