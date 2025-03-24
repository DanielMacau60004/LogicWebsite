package logic.ast.types;

import logic.ast.ASTAExp;
import logic.ast.Exp;

public abstract class ASTASingleExp extends ASTAExp implements Exp {

    public final Exp exp;

    public ASTASingleExp( Exp exp) {
        this.exp = exp;
    }

}
