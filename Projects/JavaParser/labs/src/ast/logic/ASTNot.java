package ast.logic;

import ast.ASTAExp;
import ast.Exp;
import parser.Token;
import typechecker.TypeError;

public class ASTNot extends ASTAExp implements Exp {

    public Exp e;

    public ASTNot(Token token, Exp e) {
        super(token);
        this.e = e;
    }

    @Override
    public <T, E> T accept(Visitor<T, E> v, E env) {
        return v.visit(this, env);
    }

    @Override
    public String toString() {
        return super.toString() + "(" + e + ")";
    }

    @Override
    public String proof() {
        return "("+e.proof()+") "+ this + " [NOT]";
    }
}
