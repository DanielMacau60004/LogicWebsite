package ast.logic;


import ast.Exp;
import ast.FOLVisitor;
import ast.types.ASTAPairExp;
import ast.PropVisitor;
import parser.ExpressionsParser;
import parser.Token;
import symbols.Env;

public class ASTEquivalence extends ASTAPairExp {

	public ASTEquivalence(Exp e1, Exp e2) {
		super(e1, e2);
	}

	@Override
	public <T> T accept(PropVisitor<T> v) {
		return v.visit(this);
	}

	@Override
	public <T, E> T accept(FOLVisitor<T, E> v, E env) { return v.visit(this, env); }

	@Override
	public String toString() {
		return left.toString() + " " + getToken(ExpressionsParser.EQUIVALENT) + " " + right.toString();
	}

}
