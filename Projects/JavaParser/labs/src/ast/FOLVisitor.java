package ast;

import ast.logic.*;
import ast.symbols.ASTDelPred;
import ast.symbols.ASTParenthesis;
import ast.symbols.ASTSequence;
import ast.types.ASTBool;
import ast.types.ASTConstant;
import ast.types.ASTPred;
import ast.types.ASTVariable;

public interface FOLVisitor<T, E> {

    T visit(ASTDelPred e, E env);

    T visit(ASTBool e, E env);

    T visit(ASTConstant e, E env);

    T visit(ASTVariable e, E env);

    T visit(ASTNot e, E env);

    T visit(ASTAnd e, E env);

    T visit(ASTOr e, E env);

    T visit(ASTImplication e, E env);

    T visit(ASTEquivalence e, E env);

    T visit(ASTComp e, E env);

    T visit(ASTPred e, E env);

    T visit(ASTExistential e, E env);

    T visit(ASTUniversal e, E env);

    T visit(ASTParenthesis e, E env);

    T visit(ASTSequence e, E env);

}
