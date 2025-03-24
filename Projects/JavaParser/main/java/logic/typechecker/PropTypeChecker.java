package logic.typechecker;

import logic.ast.Exp;
import logic.ast.PropVisitor;
import logic.ast.logic.*;
import logic.ast.types.ASTBool;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.types.BoolType;
import logic.types.TableType;
import logic.types.Type;

public class PropTypeChecker implements PropVisitor<Type> {

    public static ErrorHandler errorHandler;

    @Override
    public Type visit(ASTAnd e) {
        Type t1 = e.left.accept(this);
        Type t2 = e.right.accept(this);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTBiconditional e) {
        Type t1 = e.left.accept(this);
        Type t2 = e.right.accept(this);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTNot e) {
        Type t = e.exp.accept(this);

        return new TypeBuilder(e, t)
                .addFunction(new Header(TableType.singleton).ret(TableType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTOr e) {
        Type t1 = e.left.accept(this);
        Type t2 = e.right.accept(this);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTBool e) {
        return TableType.singleton;
    }

    @Override
    public Type visit(ASTLiteral e) {
        return TableType.singleton;
    }

    @Override
    public Type visit(ASTImplication e) {
        Type t1 = e.left.accept(this);
        Type t2 = e.right.accept(this);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(TableType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTSequence e) {
        Type type = null;
        for (Exp exp : e.sequence)
            type = exp.accept(this);

        e.setType(type);
        return type;
    }

    @Override
    public Type visit(ASTComp e) {
        Type t1 = e.left.accept(this);
        Type t2 = e.right.accept(this);

        return new TypeBuilder(e, t1, t2)
                .addFunction(new Header(TableType.singleton, TableType.singleton).ret(BoolType.singleton))
                .setErrorHandler(errorHandler)
                .build();
    }

    @Override
    public Type visit(ASTParenthesis e) {
        return e.e.accept(this);
    }

    public static Type checker(Exp e) throws TypeCheckerError {
        errorHandler = new ErrorHandler();
        PropTypeChecker i = new PropTypeChecker();

        Type type = e.accept(i);
        e.setType(type);
        if(errorHandler.hasErrors())
            throw new TypeCheckerError(errorHandler.getErrors());
        return type;
    }



}