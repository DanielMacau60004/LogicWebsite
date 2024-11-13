package ast.logic;

import ast.ASTAExp;
import ast.Exp;
import parser.Token;

public class ASTLiteral extends ASTAExp implements Exp {

    public String id;

    public ASTLiteral(Token token, String id) {
        super(token);
        this.id = id;
    }

    @Override
    public <T, E> T accept(Visitor<T, E> v, E env) {
        return v.visit(this, env);
    }


    @Override
    public String toString() {
        return id;
    }

    @Override
    public String proof() {
        return this+" [PROP]";
    }
}
