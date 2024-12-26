package ast.logic;


import ast.ASTAPairExp;
import ast.Exp;
import ast.PropVisitor;
import parser.Token;

public class ASTEquivalence extends ASTAPairExp implements Exp {

	public ASTEquivalence(Token token, Exp e1, Exp e2) {
		super(token, e1, e2);
	}

	@Override
	public <T> T accept(PropVisitor<T> v) {
		return v.visit(this);
	}

}
