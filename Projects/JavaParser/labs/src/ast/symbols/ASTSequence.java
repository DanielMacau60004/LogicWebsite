package ast.symbols;

import ast.ASTAExp;
import ast.Exp;
import ast.PropVisitor;

import java.util.LinkedList;
import java.util.List;

public class ASTSequence extends ASTAExp implements Exp {

    public List<Exp> sequence;

    public ASTSequence(Exp firstExp) {
        super(null);
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
    public String toString() {
        StringBuilder expression = new StringBuilder();
        for (Exp exp : sequence)
            expression.append(exp.toString()).append("\n");
        return expression.toString();
    }
}
