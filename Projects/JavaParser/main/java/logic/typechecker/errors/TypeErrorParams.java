package logic.typechecker.errors;

import logic.ast.Exp;
import logic.typechecker.Function;
import logic.typechecker.TypeError;
import logic.types.Type;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class TypeErrorParams extends TypeError {

    public TypeErrorParams(Exp exp, List<Type> values, Set<Function> functions) {
        super(buildMessage(exp, values, functions));
    }

    private static String buildMessage(Exp exp, List<Type> values, Set<Function> functions) {
        StringBuilder error = new StringBuilder();
        String format = values.stream().map(Object::toString).collect(Collectors.joining(", "));
        error.append(String.format("Encountered: \"%s\" in expression " + exp + "!\n",
                String.format("%s", format)));
        error.append("\t\t\t  Was expecting one of:\n");
        error.append( functions.stream()
                .map(fun-> String.format("\t\t\t\t%s -> %s", fun.getTypes(), fun.getReturn())).collect(Collectors.joining("\n")));
        return error.toString();
    }

}
