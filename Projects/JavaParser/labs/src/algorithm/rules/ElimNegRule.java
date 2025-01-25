package algorithm.rules;


public class ElimNegRule implements Rule{

    Rule expr1;
    Rule expr2;

    public ElimNegRule(Rule expr1, Rule expr2) {
        this.expr1 = expr1;
        this.expr2 = expr2;
    }

    @Override
    public <T, E> T accept(NDVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }
}
