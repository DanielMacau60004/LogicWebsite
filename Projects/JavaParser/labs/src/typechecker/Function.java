package typechecker;

import types.Type;

import java.util.List;

public interface Function {

    String getTypes();
    Type getReturn();
    float check(List<Type> types);

}
