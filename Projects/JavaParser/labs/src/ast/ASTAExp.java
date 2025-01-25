package ast;

import algorithm.rules.NDVisitor;
import parser.ExpressionsParser;
import types.Type;
import types.UnitType;

public abstract class ASTAExp implements Exp {

    protected Type type = UnitType.singleton;

    @Override
    public void setType(Type type) {
        this.type = type;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public <T> T accept(PropVisitor<T> v) {
        throw new RuntimeException("This operation is not valid in propositional logic");}

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) {
        throw new RuntimeException("This operation is not valid in first-order logic");}

    @Override
    public <T, E> T accept(NDVisitor<T, E> v, E env) {
        return v.visit(this, env);
    }

    protected String getToken(int kind) {
        return ExpressionsParser.tokenImage[kind].replace("\"","");
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof ASTAExp s)
            return this.toString().equals(s.toString());
        return false;
    }

    @Override
    public int hashCode() {
        return this.toString().hashCode();
    }
}
