package types;

public class TermType implements Type {

	public static final TermType singleton = new TermType();

	private TermType() {
	}

	@Override
	public String toString() {
		return "term";
	}

	@Override
	public boolean equals(Object obj) {
		return obj instanceof VariableType || obj instanceof ConstantType;
	}
}
