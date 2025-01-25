package algorithm.rules;

import ast.Exp;

public interface NDVisitor<T, E> {

    T visit(Exp e, E env);

    T visit(AbsurdityRule e, E env);

    T visit(ElimImpRule e, E env);

    T visit(ElimNegRule e, E env);

    T visit(IntrDisLeftRule e, E env);

    T visit(IntrDisRightRule e, E env);

    T visit(IntrImpRule e, E env);

}
