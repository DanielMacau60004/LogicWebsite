package types;

public class TableType implements Type {

	public static final TableType singleton = new TableType();

	private TableType() {
	}

	@Override
	public String toString() {
		return "table";
	}

}
