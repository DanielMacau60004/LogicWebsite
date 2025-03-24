package logic.tests;

import logic.ast.Exp;
import logic.interpreter.PropInterpreter;
import org.junit.Assert;
import org.junit.Test;
import logic.parser.ParseException;
import logic.parser.ExpressionsParser;
import logic.values.BoolValue;
import logic.values.TableValue;
import logic.values.Value;

import java.io.ByteArrayInputStream;
import java.util.List;

public class PropTests {

    public static Exp testExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return parser.parsePL();
    }

    public static Value testValue(String expression) throws ParseException {
        Exp exp = testExpression(expression);
        return PropInterpreter.interpret(exp);
    }

    public static boolean testTruthTable(String expression, boolean... values) throws ParseException {
        Value value = testValue(expression);
        if (!(value instanceof TableValue))
            return false;

        List<BoolValue> results = ((TableValue) value).getResults();
        if (results.size() != values.length) return false;

        for (int i = 0; i < results.size(); ++i)
            if (results.get(i).getValue() != values[i]) return false;

        return true;
    }

    /*
    ¬ : negation
    → : implication
    ↔ : bi-conditional (if and only if)
    ∧ : conjunction (and)
    ∨ : disjunction (or)
    ∀ : universal quantifier (for all)
    ∃ : existential quantifier (there exists)
    ⊥, ⊤, ≡
    */

    @Test
    public void syntaxErrors() {
        //Random
        Assert.assertThrows(ParseException.class, () -> testExpression("pp"));
        Assert.assertThrows(ParseException.class, () -> testExpression("pq d"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p d a"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p¬ ↔ ∨"));
        Assert.assertThrows(ParseException.class, () -> testExpression("⊥⊤"));
        Assert.assertThrows(ParseException.class, () -> testExpression("⊥⊥"));
        Assert.assertThrows(ParseException.class, () -> testExpression("⊥≡"));
        Assert.assertThrows(ParseException.class, () -> testExpression("⊥≡≡⊥"));
        Assert.assertThrows(ParseException.class, () -> testExpression("⊥≡"));

        //Negation
        Assert.assertThrows(ParseException.class, () -> testExpression("p¬"));
        Assert.assertThrows(ParseException.class, () -> testExpression("¬"));
        Assert.assertThrows(ParseException.class, () -> testExpression("¬↔"));
        Assert.assertThrows(ParseException.class, () -> testExpression("(¬)"));
        Assert.assertThrows(ParseException.class, () -> testExpression("(¬)q"));

        //Conjunction
        Assert.assertThrows(ParseException.class, () -> testExpression("p∧"));
        Assert.assertThrows(ParseException.class, () -> testExpression("q p∧"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p∧∧"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p∧∧q"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p∧q∧"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p(∧)q"));

        //Disjunction
        Assert.assertThrows(ParseException.class, () -> testExpression("p∨"));
        Assert.assertThrows(ParseException.class, () -> testExpression("q p∨"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p∨∨"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p∨∨q"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p∨q∨"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p(∨)q"));

        //Implication
        Assert.assertThrows(ParseException.class, () -> testExpression("p→"));
        Assert.assertThrows(ParseException.class, () -> testExpression("q p→"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p→→"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p→→q"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p→q→"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p(→)q"));

        //Equivalence
        Assert.assertThrows(ParseException.class, () -> testExpression("p↔"));
        Assert.assertThrows(ParseException.class, () -> testExpression("q p↔"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p↔↔"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p↔↔q"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p↔q↔"));
        Assert.assertThrows(ParseException.class, () -> testExpression("p(↔)q"));
    }

    @Test
    public void operations() throws ParseException {

        //Negation
        Assert.assertTrue(testTruthTable("¬⊥", true));
        Assert.assertTrue(testTruthTable("¬⊤", false));
        Assert.assertTrue(testTruthTable("¬p", true, false));
        Assert.assertTrue(testTruthTable("¬¬p", false, true));
        Assert.assertTrue(testTruthTable("¬p ∨ q", true, true, false, true));
    }

    @Test
    public void equivalences() throws ParseException {

    }

}
