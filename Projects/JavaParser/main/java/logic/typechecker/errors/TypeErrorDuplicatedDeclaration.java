package logic.typechecker.errors;

import logic.typechecker.TypeError;

public class TypeErrorDuplicatedDeclaration extends TypeError {

    public TypeErrorDuplicatedDeclaration(String variable) {
        super(String.format("Variable \"%s\" was already declared!", variable));
    }

}

