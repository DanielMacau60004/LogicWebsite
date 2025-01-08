package ast.types;

import ast.*;
import parser.ExpressionsParser;

public class ASTBool extends ASTAExp {

    public boolean e;

    public ASTBool(boolean e) {
        this.e = e;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

    @Override
    public String toString() {
        return getToken(e ? ExpressionsParser.TRUE : ExpressionsParser.FALSE);
    }
}
