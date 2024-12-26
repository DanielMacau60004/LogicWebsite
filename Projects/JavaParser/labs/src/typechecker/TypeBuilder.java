package typechecker;

import ast.Exp;
import typechecker.errors.TypeErrorParams;
import types.ErrorType;
import types.Type;

import java.util.*;

public class TypeBuilder {

    private final Exp exp;
    private final List<Type> values;
    private final Set<Function> functions;

    TypeBuilder(Exp exp, Type... type) {
        this(exp, Arrays.asList(type));
    }

    TypeBuilder(Exp exp, List<Type> type) {
        this.exp = exp;
        this.values = type;
        this.functions = new HashSet<>();
    }

    TypeBuilder addFunction(Function function) {
        this.functions.add(function);
        return this;
    }

    Type build() {
        Function function = null;
        float maxProb = -1;
        for (Function fun : functions) {
            float prob = fun.check(values);
            if (prob > maxProb) {
                maxProb = prob;
                function = fun;
            }
        }

        if (function != null && maxProb == 1) {
            exp.setType(function.getReturn());
            return function.getReturn();
        }

        PropTypeChecker.errorHandler.addException((new TypeErrorParams(exp, values, functions)));
        exp.setType(ErrorType.singleton);
        return ErrorType.singleton;
    }


}
