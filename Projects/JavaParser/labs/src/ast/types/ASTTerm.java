package ast.types;

import ast.ASTAExp;

public class ASTTerm extends ASTAExp {

    protected String name;

    public ASTTerm(String value) {
        this.name = value;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return name;
    }
}
