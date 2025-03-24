package logic.ast;

import logic.ast.types.ASTVariable;
import logic.parser.ExpressionsParser;
import logic.types.Type;
import logic.types.UnitType;

public abstract class ASTAExp implements Exp {

    protected Type type = UnitType.singleton;
    protected int name;

    int getID() {
        if(name == 0) name = toString().hashCode();
        return name;
    }

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

    protected String getToken(int kind) {
        return ExpressionsParser.tokenImage[kind].replace("\"","");
    }

    @Override
    public boolean equals(Object obj) {
        if(obj instanceof ASTAExp s)
            return getID() == s.getID();
        return false;
    }

    @Override
    public int hashCode() {
        return getID();
    }
}
