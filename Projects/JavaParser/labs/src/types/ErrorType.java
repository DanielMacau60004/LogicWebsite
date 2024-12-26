package types;

public class ErrorType implements Type {

    public static final ErrorType singleton = new ErrorType();

    private ErrorType() {
    }


}
