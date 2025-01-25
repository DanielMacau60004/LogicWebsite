package algorithm.rules;


import ast.Exp;

public class AbsurdityRule implements Rule {

    Rule rule;
    Exp conclusion;

    public AbsurdityRule(Rule rule, Exp conclusion) {
        this.rule = rule;
        this.conclusion = conclusion;
    }

    @Override
    public <T, E> T accept(NDVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }
}
