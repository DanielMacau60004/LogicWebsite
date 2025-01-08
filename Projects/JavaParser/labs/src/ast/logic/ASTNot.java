package ast.logic;

import ast.Exp;
import ast.FOLVisitor;
import ast.types.ASTASingleExp;
import ast.PropVisitor;
import parser.ExpressionsParser;

public class ASTNot extends ASTASingleExp {

    public ASTNot(Exp e) {
        super(e);
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

    @Override
    public String toString() {
        return getToken(ExpressionsParser.NOT) + exp.toString();
    }
}
