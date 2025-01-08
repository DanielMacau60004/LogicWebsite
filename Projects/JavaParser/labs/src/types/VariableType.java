package types;

public class VariableType implements Type {

	public static final VariableType singleton = new VariableType();

	private VariableType() {
	}

	@Override
	public String toString() {
		return "variable";
	}

	@Override
	public boolean equals(Object obj) {
		return obj instanceof TermType || obj instanceof VariableType;
	}
}
