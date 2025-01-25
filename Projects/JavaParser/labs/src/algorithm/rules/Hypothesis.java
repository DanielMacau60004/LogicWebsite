package algorithm.rules;

import ast.Exp;

public class Hypothesis {

    Exp exp;
    boolean isClosed;

    public Hypothesis(Exp exp) {
        this.exp = exp;
    }

}
