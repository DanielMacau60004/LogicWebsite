package logic.types;

public class UnitType implements Type {

	public static final UnitType singleton = new UnitType();

	private UnitType() {}

	@Override
	public String toString() {
		return "unit";
	}

}
