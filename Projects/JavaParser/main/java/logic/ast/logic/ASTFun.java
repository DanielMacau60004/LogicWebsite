package logic.ast.logic;

import logic.ast.ASTAExp;
import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.types.ASTTerm;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class ASTFun extends ASTTerm {

    public final String fun;
    public final List<Exp> terms;

    public ASTFun(String fun) {
       this(fun, new LinkedList<>());
    }

    public ASTFun(String fun, List<Exp> terms) {
        super(fun);
        this.fun = fun;
        this.terms = terms;
    }

    public void addTerm(Exp term) {
        terms.add(term);
    }

    @Override
    public String toString() {
        return fun + "(" + terms.stream().map(Object::toString).collect(Collectors.joining(",")) + ")";
    }

    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

}

