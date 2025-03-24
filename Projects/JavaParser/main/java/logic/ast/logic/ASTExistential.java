package logic.ast.logic;


import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.types.ASTASingleExp;
import logic.parser.ExpressionsParser;

public class ASTExistential extends ASTASingleExp {

    public final Exp variable;

    public ASTExistential(Exp variable, Exp exp) {
        super(exp);
        this.variable = variable;
    }

    @Override
    public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

    @Override
    public String toString() {
        return getToken(ExpressionsParser.EXISTENTIAL) + variable.toString() + " " + exp.toString();
    }
}
