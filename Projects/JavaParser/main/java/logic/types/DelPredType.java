package logic.types;

import logic.ast.symbols.ASTDelPred;

public class DelPredType implements Type {

    private final ASTDelPred exp;

    public DelPredType(ASTDelPred exp) {
        this.exp = exp;
    }

    public int argumentsSize() {
        return exp.size;
    }

    @Override
    public String toString() {
        return exp.toString();
    }

}
