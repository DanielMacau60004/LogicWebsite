package algorithm.rules;

import ast.Exp;

public interface Rule {

    <T,E> T accept(NDVisitor<T,E> v, E env);
}
