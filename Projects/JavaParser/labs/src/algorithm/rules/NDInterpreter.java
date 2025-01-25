package algorithm.rules;

import ast.Exp;
import ast.logic.ASTLiteral;
import ast.logic.ASTNot;
import ast.symbols.ASTParenthesis;
import symbols.Env;

public class NDInterpreter implements NDVisitor<Exp, Env<Hypothesis>> {

    private Exp negate(Exp exp) {
        if(exp instanceof ASTLiteral || exp instanceof ASTParenthesis)
            return new ASTNot(exp);
        return new ASTNot(new ASTParenthesis(exp));
    }

    @Override
    public Exp visit(Exp e, Env<Hypothesis> env) {
        return null;
    }

    @Override
    public Exp visit(AbsurdityRule e, Env<Hypothesis> env) {
        env = env.beginScope();
        Exp exp = negate(e.conclusion);

        //TODO not sure
        if(env.find(exp.toString()) != null)
            throw new RuntimeException("Hypothesis " + exp + " already exists!");

        Hypothesis hypothesis = new Hypothesis(exp);
        env.bind(exp.toString(), hypothesis);

        e.rule.accept(this, env);

        env.endScope();
        return null;
    }

    @Override
    public Exp visit(ElimImpRule e, Env<Hypothesis> env) {
        return null;
    }

    @Override
    public Exp visit(ElimNegRule e, Env<Hypothesis> env) {
        return null;
    }

    @Override
    public Exp visit(IntrDisLeftRule e, Env<Hypothesis> env) {
        return null;
    }

    @Override
    public Exp visit(IntrDisRightRule e, Env<Hypothesis> env) {
        return null;
    }

    @Override
    public Exp visit(IntrImpRule e, Env<Hypothesis> env) {
        env = env.beginScope();

        Exp exp = negate(e.conclusion);


        env.endScope();
        return null;
    }
}
