package typechecker;

import types.Type;
import types.UnitType;

import java.util.List;
import java.util.stream.Collectors;

public class Header implements Function {

    private List<Type> type;
    private Type returnType;

    Header() {
        this.returnType = UnitType.singleton;
    }

    Header(Type... type) {
        this(List.of(type));
    }

    Header(List<Type> type) {
        this();
        this.type = type;
    }

    Header ret(Type returnType) {
        this.returnType = returnType;
        return this;
    }

    @Override
    public String getTypes() {
        return type.stream().map(Type::toString).collect(Collectors.joining(", "));
    }

    @Override
    public Type getReturn() {
        return returnType;
    }

    @Override
    public float check(List<Type> types) {
        if (types.size() != type.size())
            return 0;

        float sum = 0;
        for (int i = 0; i < types.size(); i++)
            if (types.get(i).equals(type.get(i)))
                sum++;
        return sum/type.size();
    }
}
