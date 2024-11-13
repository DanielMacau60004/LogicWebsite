package types;

public class KnowledgeBaseType implements Type {

	public static final KnowledgeBaseType singleton = new KnowledgeBaseType();

	private KnowledgeBaseType() {
	}

	@Override
	public String toString() {
		return "knowledge base";
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
