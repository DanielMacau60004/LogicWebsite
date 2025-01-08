package ast.logic;

import ast.*;
import ast.types.ASTAPairExp;
import parser.ExpressionsParser;
import symbols.Env;

public class ASTAnd extends ASTAPairExp {

    public ASTAnd(Exp e1, Exp e2) {
        super(e1, e2);
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }

    @Override
    public String toString() {
        return left.toString() + " " + getToken(ExpressionsParser.AND) + " " + right.toString();
    }
}
