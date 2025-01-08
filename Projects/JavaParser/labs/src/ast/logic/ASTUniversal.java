package ast.logic;


import ast.Exp;
import ast.FOLVisitor;
import ast.types.ASTASingleExp;
import parser.ExpressionsParser;

public class ASTUniversal extends ASTASingleExp {

    public final Exp variable;

    public ASTUniversal(Exp variable, Exp exp) {
        super(exp);
        this.variable = variable;
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

    @Override
    public String toString() {
        return getToken(ExpressionsParser.UNIVERSAL) + variable.toString() + " (" + exp.toString()+")";
    }

}
