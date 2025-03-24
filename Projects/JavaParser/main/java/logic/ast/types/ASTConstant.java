package logic.ast.types;

import logic.ast.FOLVisitor;

public class ASTConstant extends ASTTerm {

    public ASTConstant(String value) {
        super(value);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

}
