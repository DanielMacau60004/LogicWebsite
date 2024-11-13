package values;

public class UnitValue implements Value {

	public static final UnitValue singleton = new UnitValue();

	UnitValue() {
	}

	@Override
	public String toString() {
		return "unit";
	}

	public boolean equals(Object obj) {
		return obj instanceof UnitValue;
	}

}
