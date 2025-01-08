package ast.types;

import ast.ASTAExp;
import ast.Exp;

public abstract class ASTASingleExp extends ASTAExp implements Exp {

    public final Exp exp;

    public ASTASingleExp( Exp exp) {
        this.exp = exp;
    }

}
