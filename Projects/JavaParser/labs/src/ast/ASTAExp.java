package ast;

import parser.ParserConstants;
import parser.Token;
import types.Type;
import types.UnitType;

public abstract class ASTAExp implements Exp {

    private final Token token;
    private Type type = UnitType.singleton;

    public ASTAExp() {
        this.token = null;
    }
    public ASTAExp(Token token) {
        this.token = token;
    }

    @Override
    public Token getToken() {
        return token;
    }

    @Override
    public void setType(Type type) {
        this.type = type;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public String toString() {
        return token == null ? super.toString() : ParserConstants.tokenImage[token.kind].replace("\"","");
    }

    @Override
    public String proof() {return "";}
}
