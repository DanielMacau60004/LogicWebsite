package logic.ast.types;

import logic.ast.ASTAExp;
import logic.ast.Exp;
import logic.ast.FOLVisitor;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class ASTPred extends ASTAExp {

    public final String predicate;
    public final List<Exp> terms;

    public ASTPred(String predicate) {
       this(predicate, new LinkedList<>());
    }

    public ASTPred(String predicate, List<Exp> terms) {
        this.predicate = predicate;
        this.terms = terms;
    }

    public void addTerm(Exp term) {
        terms.add(term);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }

    @Override
    public String toString() {
        return predicate + "(" + terms.stream().map(Object::toString).collect(Collectors.joining(",")) + ")";
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof ASTPred pred) return this.toString().equals(pred.toString());
        return false;
    }

    @Override
    public int hashCode() {
        return this.toString().hashCode();
    }
}

