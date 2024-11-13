package values;

import java.util.List;

public class KnowledgeBaseValue implements Value {
	private final List<TableValue> values;

	public KnowledgeBaseValue(List<TableValue> values) {
		this.values = values;
	}

	public List<TableValue> getValue() {
		return values;
	}

	@Override
	public String toString() {
		return values.toString();
	}

	@Override
	public boolean equals(Object obj) {
		return obj instanceof KnowledgeBaseValue && values == ((KnowledgeBaseValue)obj).getValue();
	}
	
}
