package ast.types;

import ast.ASTAExp;
import ast.Exp;

import java.util.Set;

public class ASTHornClause extends ASTAExp {

    public Set<Exp> clause;

    public ASTHornClause(Set<Exp> clause) {
        this.clause = clause;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof ASTHornClause pred) return this.clause.equals(pred.clause);
        return false;
    }

    @Override
    public String toString() {
        return clause.toString();
    }

    @Override
    public int hashCode() {
        return this.toString().hashCode();
    }

}
