package ast.logic;


import ast.ASTAExp;
import ast.Exp;
import parser.Token;
import typechecker.TypeError;

public class ASTDiff extends ASTAExp implements Exp {
	public Exp e1;
	public Exp e2;

	public ASTDiff(Token token, Exp e1, Exp e2) {
		super(token);
		this.e1 = e1;
		this.e2 = e2;
	}

	@Override
	public <T, E> T accept(Visitor<T, E> v, E env) {
		return v.visit(this, env);
	}

}
