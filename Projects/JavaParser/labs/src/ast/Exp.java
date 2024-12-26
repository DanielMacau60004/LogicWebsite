package ast;

import parser.Token;
import types.Type;

public interface Exp {

    Token getToken();

    void setType(Type type);

    Type getType();

    <T> T accept(PropVisitor<T> v);

}
