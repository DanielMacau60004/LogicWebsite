package logic.ast.types;

import logic.ast.FOLVisitor;

public class ASTVariable extends ASTTerm {

    public ASTVariable(String name) {
        super(name);
    }

    public void setValue(String value) {
        this.name = value;
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

}
