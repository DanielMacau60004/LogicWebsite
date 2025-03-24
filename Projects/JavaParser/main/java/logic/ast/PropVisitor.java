package logic.ast;

import logic.ast.logic.*;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.ast.types.ASTBool;

public interface PropVisitor<T> {

    T visit(ASTBool e);

    T visit(ASTLiteral e);

    T visit(ASTNot e);

    T visit(ASTAnd e);

    T visit(ASTOr e);

    T visit(ASTImplication e);

    T visit(ASTBiconditional e);

    T visit(ASTComp e);

    T visit(ASTParenthesis e);

    T visit(ASTSequence e);

}
