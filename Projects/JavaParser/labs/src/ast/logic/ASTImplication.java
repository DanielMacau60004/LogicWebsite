package ast.logic;


import ast.ASTAExp;
import ast.Exp;
import parser.Token;

public class ASTImplication extends ASTAExp implements Exp {
	public Exp e1;
	public Exp e2;

	public ASTImplication(Token token, Exp e1, Exp e2) {
		super(token);
		this.e1 = e1;
		this.e2 = e2;
	}

	@Override
	public <T, E> T accept(Visitor<T, E> v, E env){
		return v.visit(this, env);
	}

	@Override
	public String toString() {
		return "(" + e1 + " " + super.toString() + " " + e2 + ")";
	}

	@Override
	public String proof() {
		return "("+e1.proof()+" "+ e2.proof()+") "+ this + " [IMP]";
	}

}
