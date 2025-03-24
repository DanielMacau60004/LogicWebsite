package logic.interpreter;

import logic.ast.Exp;
import logic.ast.PropVisitor;
import logic.ast.logic.*;
import logic.ast.types.ASTBool;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.symbols.ASTSequence;
import logic.utils.Utils;
import logic.values.BoolValue;
import logic.values.TableValue;
import logic.values.Value;

public class PropInterpreter implements PropVisitor<Value> {

    @Override
    public Value visit(ASTAnd ast) {
        TableValue v1 = (TableValue) ast.left.accept(this);
        TableValue v2 = (TableValue) ast.right.accept(this);

        return v1.transform(ast.toString(), v2, (p) -> new BoolValue(p.left().getValue() && p.right().getValue()));
    }

    @Override
    public Value visit(ASTBiconditional ast) {
        TableValue v1 = (TableValue) ast.left.accept(this);
        TableValue v2 = (TableValue) ast.right.accept(this);

        return v1.transform(ast.toString(), v2, (p) -> new BoolValue(p.left().getValue() == p.right().getValue()));
    }

    @Override
    public Value visit(ASTNot ast) {
        TableValue v = (TableValue) ast.exp.accept(this);
        return v.transform(ast.toString(), (p) -> new BoolValue(!p.getValue()));
    }

    @Override
    public Value visit(ASTOr ast) {
        TableValue v1 = (TableValue) ast.left.accept(this);
        TableValue v2 = (TableValue) ast.right.accept(this);

        return v1.transform(ast.toString(), v2, (p) -> new BoolValue(p.left().getValue() || p.right().getValue()));
    }

    @Override
    public Value visit(ASTBool ast) {
        return new TableValue(ast.toString(), new BoolValue(ast.e));
    }

    @Override
    public Value visit(ASTLiteral ast) {
        return new TableValue(ast.toString(), ast.id);
    }

    @Override
    public Value visit(ASTImplication ast) {
        TableValue v1 = (TableValue) ast.left.accept(this);
        TableValue v2 = (TableValue) ast.right.accept(this);

        return v1.transform(ast.toString(), v2, (p) -> new BoolValue(!p.left().getValue() || p.right().getValue()));
    }

    @Override
    public Value visit(ASTSequence e) {
        Value value = null;

        for (Exp exp : e.sequence) {
            value = exp.accept(this);
            System.out.println(Utils.convertUnicodeEscapes(value.toString()));
        }
        return value;
    }

    @Override
    public Value visit(ASTComp ast) {
        Value v1 = ast.left.accept(this);
        Value v2 = ast.right.accept(this);

        return new BoolValue(v1.equals(v2));
    }

    @Override
    public Value visit(ASTParenthesis ast) {
        return ast.e.accept(this);
    }

    public static Value interpret(Exp e) {
        PropInterpreter i = new PropInterpreter();
        return e.accept(i);
    }

}
