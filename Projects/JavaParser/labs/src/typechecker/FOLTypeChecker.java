package typechecker;

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
import typechecker.errors.TypeErrorDuplicatedDeclaration;
import typechecker.errors.TypeErrorExpression;
import types.*;

import java.util.Collections;
import java.util.List;

public class FOLTypeChecker implements FOLVisitor<Type, Env<Type>> {

    public static ErrorHandler errorHandler;

    @Override
    public Type visit(ASTDelPred e, Env<Type> env) {
        if (env.find(e.predicate) != null) {
            errorHandler.addException(new TypeErrorDuplicatedDeclaration(e.predicate));
            e.setType(ErrorType.singleton);
            return ErrorType.singleton;
        }

        env.bind(e.predicate, new DelPredType(e));
        return UnitType.singleton;
    }

    @Override
    public Type visit(ASTBool e, Env<Type> env) {
        return BoolType.singleton;
    }

    @Override
    public Type visit(ASTConstant e, Env<Type> env) {
        return ConstantType.singleton;
    }

    @Override
    public Type visit(ASTVariable e, Env<Type> env) {
        Type type = env.find(e.getName());

        if (type == null) {
            errorHandler.addException(new TypeErrorExpression(e.getName(), env.getMatching(e.getName())));
            e.setType(ErrorType.singleton);
            return ErrorType.singleton;
        }

        return VariableType.singleton;
    }

    @Override
    public Type visit(ASTNot e, Env<Type> env) {
        Type t = e.exp.accept(this, env);

        return new TypeBuilder(e, t)
                .addFunction(new Header(BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTAnd e, Env<Type> env) {
        Type t1 = e.left.accept(this, env);
        Type t2 = e.right.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(BoolType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTOr e, Env<Type> env) {
        Type t1 = e.left.accept(this, env);
        Type t2 = e.right.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(BoolType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTImplication e, Env<Type> env) {
        Type t1 = e.left.accept(this, env);
        Type t2 = e.right.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(BoolType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTBiconditional e, Env<Type> env) {
        Type t1 = e.left.accept(this, env);
        Type t2 = e.right.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(BoolType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTComp e, Env<Type> env) {
        Type t1 = e.left.accept(this, env);
        Type t2 = e.right.accept(this, env);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(BoolType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTPred e, Env<Type> env) {
        DelPredType dec = (DelPredType)env.find(e.predicate);
        if(dec == null) {
            errorHandler.addException(new TypeErrorExpression(e.predicate, Collections.emptySet()));
            e.setType(ErrorType.singleton);
            return ErrorType.singleton;
        }

        List<Type> types = e.terms.stream().map(term -> term.accept(this, env)).toList();
        return new TypeBuilder(e, types)
                .addFunction(new Header(Collections.nCopies(dec.argumentsSize(), TermType.singleton))
                        .ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTExistential e, Env<Type> env) {
        env = env.beginScope();
        if (env.find(e.variable.toString()) != null) {
            errorHandler.addException(new TypeErrorDuplicatedDeclaration(e.variable.toString()));
            e.setType(ErrorType.singleton);
            return ErrorType.singleton;
        }

        env.bind(e.variable.toString(), VariableType.singleton);
        Type var = e.variable.accept(this, env);
        Type exp = e.exp.accept(this, env);
        env.endScope();

        return new TypeBuilder(e, var, exp)
                .addFunction(new Header(VariableType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTUniversal e, Env<Type> env) {
        env = env.beginScope();
        if (env.find(e.variable.toString()) != null) {
            errorHandler.addException(new TypeErrorDuplicatedDeclaration(e.variable.toString()));
            e.setType(ErrorType.singleton);
            return ErrorType.singleton;
        }

        env.bind(e.variable.toString(), VariableType.singleton);
        Type var = e.variable.accept(this, env);
        Type exp = e.exp.accept(this, env);
        env.endScope();

        return new TypeBuilder(e, var, exp)
                .addFunction(new Header(VariableType.singleton, BoolType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTParenthesis e, Env<Type> env) {
        return e.e.accept(this, env);
    }

    @Override
    public Type visit(ASTSequence e, Env<Type> env) {
        Type type = null;
        for (Exp exp : e.sequence)
            type = exp.accept(this, env);

        e.setType(type);
        return type;
    }

    public static Type checker(Exp e) throws TypeCheckerError {
        errorHandler = new ErrorHandler();
        FOLTypeChecker i = new FOLTypeChecker();
        Env<Type> env = new Env<>();

        Type type = e.accept(i, env);
        e.setType(type);
        if (errorHandler.hasErrors())
            throw new TypeCheckerError(errorHandler.getErrors());
        return type;
    }

}
