package ast;

import parser.ParserConstants;
import parser.Token;
import types.Type;
import types.UnitType;

public abstract class ASTAExp implements Exp {

    protected final Token token;
    protected Type type = UnitType.singleton;

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

    protected String getToken(int kind) {
        return ParserConstants.tokenImage[kind].replace("\"","");
    }
}
