package ast;

import typechecker.TypeError;

import java.util.LinkedList;
import java.util.List;

public class ASTSequence extends ASTAExp implements Exp {

    public List<Exp> sequence;

    public ASTSequence(Exp firstExp) {
        sequence = new LinkedList<>();
        sequence.add(firstExp);
    }

    public void addExp(Exp exp) {
        sequence.add(exp);
    }

    @Override
    public <T, E> T accept(Visitor<T, E> v, E env){
        return v.visit(this, env);
    }

    @Override
    public String toString() {
        StringBuilder result = new StringBuilder();

        for(Exp e : sequence)
            result.append(e).append("\n");
        return result.toString();
    }

    @Override
    public String proof() {
        StringBuilder result = new StringBuilder();
        for(Exp e : sequence)
            result.append(e.proof()).append("\n");
        return result.toString();
    }
}
