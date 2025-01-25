package ast;

import algorithm.rules.NDInterpreter;
import algorithm.rules.NDVisitor;
import algorithm.rules.Rule;
import parser.Token;
import symbols.Env;
import types.Type;

public interface Exp extends Rule {

    void setType(Type type);

    Type getType();

    <T> T accept(PropVisitor<T> v);

    <T,E> T accept(FOLVisitor<T,E> v, E env);

}
