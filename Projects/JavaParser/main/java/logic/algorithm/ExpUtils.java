package logic.algorithm;

import logic.ast.Exp;
import logic.ast.logic.ASTLiteral;
import logic.ast.logic.ASTNot;
import logic.ast.symbols.ASTParenthesis;
import logic.ast.types.ASTBool;
import logic.ast.types.ASTPred;

public class ExpUtils {
    public static final Exp BOT = new ASTBool(false);

    public static Exp removeParenthesis(Exp exp) {
        while (exp instanceof ASTParenthesis par)
            exp = par.exp;
        return exp;
    }

    public static Exp negate(Exp exp) {
        if(exp instanceof ASTLiteral || exp instanceof ASTPred || exp instanceof ASTParenthesis || exp instanceof ASTNot)
            return new ASTNot(exp);
        return new ASTNot(new ASTParenthesis(exp));
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
