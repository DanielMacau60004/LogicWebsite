package logic.typechecker;

import logic.types.ErrorType;

import java.util.SortedSet;
import java.util.TreeSet;
import java.util.stream.Collectors;

public class ErrorHandler {

    private final SortedSet<TypeError> exceptionList;

    public ErrorHandler() {
        exceptionList = new TreeSet<>();
    }

    public void addException(TypeError error) {
        //Ignore errors propagated by the ErrorType
        if(!error.getMessage().contains(ErrorType.singleton.toString()))
            exceptionList.add(error);
    }

    public boolean hasErrors() {
        return !exceptionList.isEmpty();
    }

    public String getErrors() {
        return "\n" +
                String.format("%4s | %4s : %s\n", "Line", "Col", "Message") +
                exceptionList.stream().map(e ->
                        String.format("%4d | %4d | %s\n", e.getLine(), e.getCol(), e.getMessage())
                ).collect(Collectors.joining());
    }

}
