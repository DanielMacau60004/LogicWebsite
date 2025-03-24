package logic.typechecker.errors;

import logic.typechecker.TypeError;
import java.util.Set;

public class TypeErrorExpression extends TypeError {

    public TypeErrorExpression(String variable, Set<String> alternatives) {
        super(buildMessage(variable, alternatives));
    }

    private static String buildMessage(String id, Set<String> alternatives) {
        StringBuilder error = new StringBuilder();
        error.append(String.format("Variable \"%s\" was never declared!",id));

        if(!alternatives.isEmpty())
            error.append("\n\t\t\t  Did you mean: ").append(String.join(", ", alternatives));
        return  error.toString();
    }
}

