package ast;

import parser.Token;

public abstract class ASTASingleExp extends ASTAExp implements Exp {

    public final Exp exp;

    public ASTASingleExp(Token token, Exp exp) {
        super(token);
        this.exp = exp;
    }

    @Override
    public String toString() {
        return token == null ? super.toString() : getToken(token.kind) + exp;
    }

}
