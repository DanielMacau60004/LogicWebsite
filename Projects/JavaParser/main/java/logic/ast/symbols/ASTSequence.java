package logic.ast.symbols;

import logic.ast.ASTAExp;
import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.PropVisitor;

import java.util.LinkedList;
import java.util.List;

public class ASTSequence extends ASTAExp {

    public List<Exp> sequence;

    public ASTSequence(Exp firstExp) {
        sequence = new LinkedList<>();
        sequence.add(firstExp);
    }

    public void addExp(Exp exp) {
        sequence.add(exp);
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

    @Override
    public String toString() {
        StringBuilder expression = new StringBuilder();
        for (Exp exp : sequence)
            expression.append(exp.toString()).append("\n");
        return expression.toString();
    }
}
