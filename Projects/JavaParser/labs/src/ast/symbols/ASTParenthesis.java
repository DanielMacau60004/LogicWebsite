package ast.symbols;

import ast.ASTASingleExp;
import ast.Exp;
import ast.PropVisitor;
import parser.Token;

public class ASTParenthesis extends ASTASingleExp implements Exp {
    public Token left, right;
    public Exp e;

    public ASTParenthesis(Token left, Token right, Exp e) {
        super(left, e);
        this.left = left;
        this.right = right;
        this.e = e;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public String toString() {
        return getToken(left.kind) + e.toString() + getToken(right.kind);
    }
}
