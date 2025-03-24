package logic.ast.symbols;

import logic.ast.ASTAExp;
import logic.ast.FOLVisitor;

public class ASTDelPred extends ASTAExp {

    public final String predicate;
    public final int size;

    public ASTDelPred(String predicate) {
        String[] args = predicate.split("/");
        this.predicate = args[0];
        this.size = Integer.parseInt(args[1]);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }

    @Override
    public String toString() {
        return predicate + "/" + size;
    }

}

