package ast.logic;


import ast.ASTAExp;
import ast.Exp;
import parser.Token;

public class ASTModels extends ASTAExp implements Exp {
	public Exp kb;
	public Exp e;

	public ASTModels(Token token, Exp kb, Exp e) {
		super(token);
		this.kb = kb;
		this.e = e;
	}

	@Override
	public <T, E> T accept(Visitor<T, E> v, E env){
		return v.visit(this, env);
	}

	@Override
	public String toString() {
		return "(" + kb + " " + super.toString() + " " + e + ")";
	}

	@Override
	public String proof() {
		return null;
	}

}
