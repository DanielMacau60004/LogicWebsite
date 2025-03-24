package logic.ast.logic;


import logic.ast.Exp;
import logic.ast.FOLVisitor;
import logic.ast.types.ASTAPairExp;
import logic.ast.PropVisitor;
import logic.parser.ExpressionsParser;

public class ASTBiconditional extends ASTAPairExp {

	public ASTBiconditional(Exp e1, Exp e2) {
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
		return left.toString() + " " + getToken(ExpressionsParser.BICONDITIONAL) + " " + right.toString();
	}

}
