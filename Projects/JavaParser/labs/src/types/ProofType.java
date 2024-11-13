package types;

public class ProofType implements Type {

	public static final ProofType singleton = new ProofType();

	private ProofType() {
	}

	@Override
	public String toString() {
		return "proof";
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
