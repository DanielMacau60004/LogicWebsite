package logic.ast.symbols;

import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.types.ASTASingleExp;
import logic.ast.PropVisitor;
import logic.parser.ExpressionsParser;

public class ASTParenthesis extends ASTASingleExp {
    public Exp e;

    public ASTParenthesis(Exp e) {
        super(e);
        this.e = e;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

    @Override
    public String toString() {
        return getToken(ExpressionsParser.LPAR) + e.toString() + getToken(ExpressionsParser.RPAR);
    }
}
