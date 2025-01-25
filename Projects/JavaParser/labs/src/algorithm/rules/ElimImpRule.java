package algorithm.rules;


public class ElimImpRule implements Rule{

    Rule expr1;
    Rule expr2;

    public ElimImpRule(Rule expr1, Rule expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }

    @Override
    public <T, E> T accept(NDVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }

}
