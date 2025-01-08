package ast.logic;

import ast.ASTAExp;
import ast.Exp;
import ast.FOLVisitor;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class ASTFun extends ASTAExp {

    public final String fun;
    public final List<Exp> terms;

    public ASTFun(String fun) {
       this(fun, new LinkedList<>());
    }

    public ASTFun(String fun, List<Exp> terms) {
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
}

