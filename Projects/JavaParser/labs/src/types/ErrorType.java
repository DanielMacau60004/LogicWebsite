package types;

public class ErrorType implements Type {

    public static final ErrorType singleton = new ErrorType();

    private ErrorType() {
    }

    @Override
    public String toString() {
        return "error-type-exception";
    }

    @Override
    public boolean isPrimitive() {
        return false;
    }

    @Override
    public String connectedName() {
        throw new NullPointerException();
    }
}
