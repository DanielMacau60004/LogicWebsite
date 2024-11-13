package ast;

import ast.logic.*;
import ast.types.ASTBool;
import ast.logic.ASTLiteral;
import parser.Token;
import types.Type;

public interface Exp {

    Token getToken();

    void setType(Type type);

    Type getType();

    String proof();

    interface Visitor<T, E> {

        T visit(ASTAnd e, E env);

        T visit(ASTEquivalence e, E env);

        T visit(ASTNot e, E env);

        T visit(ASTOr e, E env);

        T visit(ASTBool e, E env);

        T visit(ASTDiff e, E env);

        T visit(ASTLiteral e, E env);

        T visit(ASTImplication e, E env);

        T visit(ASTSequence e, E env);

        T visit(ASTKnowledgeBase e, E env);

        T visit(ASTModels e, E env);

    }

    <T, E> T accept(Visitor<T, E> v, E env);

}
