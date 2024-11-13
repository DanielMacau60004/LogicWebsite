package types;

public class UnitType implements Type {

	public static final UnitType singleton = new UnitType();

	private UnitType() {}

	@Override
	public String toString() {
		return "unit";
	}
	@Override
	public boolean isPrimitive() {
		return false;
	}

	@Override
	public String connectedName() {
		return "unit";
	}

}
