package logic.ast;

import logic.types.Type;

public interface Exp {


    void setType(Type type);

    Type getType();

    <T> T accept(PropVisitor<T> v);

    <T,E> T accept(FOLVisitor<T,E> v, E env);

}
