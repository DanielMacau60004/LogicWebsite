package logic.ast.logic;

import logic.ast.ASTAExp;
import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.PropVisitor;

public class ASTLiteral extends ASTAExp implements Exp {

    public String id;

    public ASTLiteral(String id) {
        this.id = id;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        return v.visit(this);
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) {return v.visit(this, env);}

    @Override
    public String toString() {
        return id;
    }

}
