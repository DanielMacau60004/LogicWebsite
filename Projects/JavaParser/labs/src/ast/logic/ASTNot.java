package ast.logic;

import ast.ASTASingleExp;
import ast.Exp;
import ast.PropVisitor;
import parser.Token;

public class ASTNot extends ASTASingleExp implements Exp {

    public ASTNot(Token token, Exp e) {
        super(token, e);
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

}
