package ast.types;

import ast.ASTAExp;
import ast.Exp;
import ast.PropVisitor;
import parser.Token;

public class ASTBool extends ASTAExp implements Exp {

    public boolean e;

    public ASTBool(Token token, boolean e) {
        super(token);
        this.e = e;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public String toString() {
        return getToken(token.kind);
    }
}
