package logic.algorithm.backups.backup6.implementation.newImp;

import logic.ast.Exp;
import logic.ast.logic.ASTLiteral;
import logic.ast.logic.ASTNot;
import logic.ast.symbols.ASTParenthesis;

public class ExpUtils {
    public static final Exp BOT = new ASTLiteral("\\u22a5");

    public static Exp removeParenthesis(Exp exp) {
        while (exp instanceof ASTParenthesis par)
            exp = par.exp;
        return exp;
    }

    public static boolean isNegated(Exp exp) {
        return exp instanceof ASTNot;
    }

    public static Exp invert(Exp exp) {
        exp = removeParenthesis(exp);
        if(exp instanceof ASTNot not)
            return removeParenthesis(not.exp);
        return new ASTNot(exp instanceof ASTLiteral ? exp : new ASTParenthesis(exp));
    }

}
