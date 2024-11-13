package types;

public class ModelsType implements Type {

	public static final ModelsType singleton = new ModelsType();

	private ModelsType() {
	}

	@Override
	public String toString() {
		return "models";
	}

	@Override
	public boolean isPrimitive() {
		return false;
	}

	@Override
	public String connectedName() {
		return toString();
	}
}
