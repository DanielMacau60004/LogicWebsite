package ast;

import ast.logic.*;
import ast.symbols.ASTParenthesis;
import ast.symbols.ASTSequence;
import ast.types.ASTBool;

public interface PropVisitor<T> {

    T visit(ASTBool e);

    T visit(ASTLiteral e);

    T visit(ASTNot e);

    T visit(ASTAnd e);

    T visit(ASTOr e);

    T visit(ASTImplication e);

    T visit(ASTEquivalence e);

    T visit(ASTComp e);

    T visit(ASTParenthesis e);

    T visit(ASTSequence e);

}
