package logic.ast;

import logic.ast.logic.*;
import logic.ast.symbols.ASTDelPred;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.ast.types.ASTBool;
import logic.ast.types.ASTConstant;
import logic.ast.types.ASTPred;
import logic.ast.types.ASTVariable;

public interface FOLVisitor<T, E> {

    T visit(ASTDelPred e, E env);

    T visit(ASTBool e, E env);

    T visit(ASTConstant e, E env);

    T visit(ASTVariable e, E env);

    T visit(ASTLiteral e, E env);

    T visit(ASTNot e, E env);

    T visit(ASTAnd e, E env);

    T visit(ASTOr e, E env);

    T visit(ASTImplication e, E env);

    T visit(ASTBiconditional e, E env);

    T visit(ASTComp e, E env);

    T visit(ASTPred e, E env);

    T visit(ASTExistential e, E env);

    T visit(ASTUniversal e, E env);

    T visit(ASTParenthesis e, E env);

    T visit(ASTSequence e, E env);

    T visit(ASTFun astFun, E env);
}
