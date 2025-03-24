package logic.ast.types;

import logic.ast.ASTAExp;

import java.util.HashSet;
import java.util.Set;

public class ASTHornClauses extends ASTAExp {

    public Set<ASTHornClause> clauses = new HashSet<>();

    public void addClause(ASTHornClause clause) {
        clauses.add(clause);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof ASTHornClauses pred) return this.clauses.equals(pred.clauses);
        return false;
    }

    @Override
    public String toString() {
        return clauses.toString();
    }

    @Override
    public int hashCode() {
        return this.toString().hashCode();
    }

}
