package algorithm.rules;


import ast.Exp;

public class IntrImpRule implements Rule {

    Rule expr;
    Exp conclusion;

    public IntrImpRule(Rule expr, Exp conclusion) {
        this.expr = expr;
        this.conclusion = conclusion;
    }

    @Override
    public <T, E> T accept(NDVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }
}
