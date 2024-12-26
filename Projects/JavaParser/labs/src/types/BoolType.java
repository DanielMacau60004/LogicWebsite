package types;

public class BoolType implements Type {

	public static final BoolType singleton = new BoolType();

	private BoolType() {
	}

	@Override
	public String toString() {
		return "bool";
	}

}
