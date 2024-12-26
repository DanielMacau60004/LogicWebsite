package ast;

import parser.Token;

public abstract class ASTAPairExp extends  ASTAExp implements Exp {

    public Exp left;
    public Exp right;

    public ASTAPairExp(Token token, Exp left, Exp right) {
        super(token);
        this.left =left;
        this.right = right;
    }

    @Override
    public String toString() {
        return left.toString() + " " + getToken(token.kind)+" "+right.toString();
    }

}
