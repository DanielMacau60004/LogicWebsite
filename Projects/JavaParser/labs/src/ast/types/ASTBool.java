package ast.types;

import ast.ASTAExp;
import ast.Exp;
import parser.Token;
import typechecker.TypeError;

public class ASTBool extends ASTAExp implements Exp {

    public boolean e;

    public ASTBool(Token token, boolean e) {
        super(token);
        this.e = e;
    }

    @Override
    public <T, E> T accept(Visitor<T, E> v, E env){
        return v.visit(this, env);
    }

    @Override
    public String toString() {
        return String.valueOf(e);
    }
}
