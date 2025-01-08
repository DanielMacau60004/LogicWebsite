package ast.types;

import ast.ASTAExp;
import ast.Exp;

public abstract class ASTAPairExp extends ASTAExp implements Exp {

    public Exp left;
    public Exp right;

    public ASTAPairExp(Exp left, Exp right) {
        this.left = left;
        this.right = right;
    }

}
