package interpreter;

import ast.*;
import ast.logic.*;
import ast.types.ASTBool;
import ast.logic.ASTLiteral;
import symbols.Env;
import values.*;

import java.util.ArrayList;
import java.util.List;

public class Interpreter implements Exp.Visitor<Value, Env<Value>> {

    @Override
    public Value visit(ASTAnd ast, Env<Value> env) {
        TableValue v1 = (TableValue) ast.e1.accept(this, env);
        TableValue v2 = (TableValue) ast.e2.accept(this, env);

        return new TableValue(v1, v2,
                (p) -> new BoolValue(p.getLeft().getValue() && p.getRight().getValue()));
    }

    @Override
    public Value visit(ASTEquivalence ast, Env<Value> env) {
        Value v1 = ast.e1.accept(this, env);
        Value v2 = ast.e2.accept(this, env);
        return new BoolValue(v1.equals(v2));
    }

    @Override
    public Value visit(ASTNot ast, Env<Value> env) {
        TableValue v = (TableValue) ast.e.accept(this, env);
        return new TableValue(v, (p) -> new BoolValue(!p.getValue()));
    }

    @Override
    public Value visit(ASTOr ast, Env<Value> env) {
        TableValue v1 = (TableValue) ast.e1.accept(this, env);
        TableValue v2 = (TableValue) ast.e2.accept(this, env);

        return new TableValue(v1, v2,
                (p) -> new BoolValue(p.getLeft().getValue() || p.getRight().getValue()));
    }

    @Override
    public Value visit(ASTBool ast, Env<Value> env) {
        return new BoolValue(ast.e);
    }

    @Override
    public Value visit(ASTDiff ast, Env<Value> env) {
        Value v1 = ast.e1.accept(this, env);
        Value v2 = ast.e2.accept(this, env);
        return new BoolValue(!v1.equals(v2));
    }

    @Override
    public Value visit(ASTLiteral ast, Env<Value> env) {
        return new TableValue(ast.id);
    }

    @Override
    public Value visit(ASTImplication ast, Env<Value> env) {
        TableValue v1 = (TableValue) ast.e1.accept(this, env);
        TableValue v2 = (TableValue) ast.e2.accept(this, env);


        return new TableValue(v1, v2,
                (p) -> new BoolValue(!p.getLeft().getValue() || p.getRight().getValue()));
    }

    @Override
    public Value visit(ASTSequence e, Env<Value> env) {
        Value value = null;
        for (Exp exp : e.sequence) {
            value = exp.accept(this, env);
            System.out.println(value);
        }
        return value;
    }

    @Override
    public Value visit(ASTKnowledgeBase e, Env<Value> env) {
        List<TableValue> values = new ArrayList<>();
        for(Exp exp : e.e)
            values.add((TableValue) exp.accept(this,env));
        return new KnowledgeBaseValue(values);
    }

    @Override
    public Value visit(ASTModels e, Env<Value> env) {
        return new ModelsValue((KnowledgeBaseValue) e.kb.accept(this,env), (TableValue) e.e.accept(this,env));
    }

    public static Value interpret(Exp e) {
        Interpreter i = new Interpreter();
        Env<Value> env = new Env<>();
        return e.accept(i, env);
    }

}
