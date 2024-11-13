package ast.logic;


import ast.ASTAExp;
import ast.Exp;
import parser.Token;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

public class ASTKnowledgeBase extends ASTAExp implements Exp {
	public List<Exp> e;

	public ASTKnowledgeBase() {
		super(null);
		this.e = new LinkedList<>();
	}

	public void addExp(Exp e) {
		this.e.add(e);
	}

	@Override
	public <T, E> T accept(Visitor<T, E> v, E env){
		return v.visit(this, env);
	}

	@Override
	public String toString() {
		return "{" + e.stream()
				.map(Exp::toString)
				.collect(Collectors.joining(",")) + "}";
	}

	@Override
	public String proof() {
		return null;
	}

}
