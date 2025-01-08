package types;

public class ConstantType implements Type {

	public static final ConstantType singleton = new ConstantType();

	private ConstantType() {
	}

	@Override
	public String toString() {
		return "constant";
	}

	@Override
	public boolean equals(Object obj) {
		return obj instanceof TermType || obj instanceof ConstantType;
	}
}
