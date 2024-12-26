package ast.logic;

import ast.ASTAExp;
import ast.Exp;
import ast.PropVisitor;
import parser.Token;

public class ASTLiteral extends ASTAExp implements Exp {

    public String id;

    public ASTLiteral(Token token, String id) {
        super(token);
        this.id = id;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public String toString() {
        return id;
    }
}
