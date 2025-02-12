package algorithm.implementation;

import algorithm.implementation.newImp.ERule;
import algorithm.implementation.newImp.Solution;
import algorithm.implementation.newImp.StateGraph;
import algorithm.implementation.newImp.TransitionGraph;
import ast.Exp;
import ast.symbols.ASTSequence;
import org.junit.jupiter.params.provider.ValueSource;
import parser.ExpressionsParser;
import parser.ParseException;
import utils.Utils;

import org.junit.jupiter.params.ParameterizedTest;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestStateMachine {

    public static Exp createExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return ((ASTSequence) parser.parseProp()).sequence.get(0);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "a → a",
            "a → (a ∨ b)",
            "(a ∨ a) → a",
            "(a ∧ b) → a",
            "a → (b → a)",
            "¬a → (a → b)",
            "¬(a ∨ b) → ¬a",
            "(b → c) → ((a ∧ b) → (a ∧ c))",
            //"((a → b) ∧ ¬b) → ¬a", // NOT WORKING MULTI-BRANCHING NO BOT
            "a ∨ (a → b)",
            "(a → b) ∨ (b → d)",
            "(a → ¬(¬a)) ∧ (¬(¬a) → a)", // WORKING IF WE FIX ¬¬a TO ¬(¬a)
            "((a → b) ∧ (b → c)) → (a → c)",
            "(b → c) → ((a ∧ b) → c)",
            "(a → (b → c)) → ((a → b) → (a → c))",
            "((a → b) → (¬b → ¬a)) ∧ ((¬b → ¬a) → (a → b))",
            "a ∨ ¬a",
            "((a → d) → a) → a",
            "¬(¬(¬p)) → ¬p",
            "⊥ → a",
            "(¬(¬a ∨ ¬b)) → (a ∧ b)", // WORKING
            "((a → b) ∧ (b → a)) → (((a ∧ c) → (b ∧ c)) ∧ ((b ∧ c) → (a ∧ c)))",
            "(p ∨ q) → (q ∨ p)",
            "(p ∨ q) → (p ∨ (q ∨ p))",
            "((p ∨ q) ∨ r) → (p ∨ (q ∨ r))",
            "(¬p ∨ ¬q) → ¬(p ∧ q)",
            "((p ∨ q) ∨ (r ∨ s)) → ((p ∨ s) ∨ (r ∨ q))", // O BIXO
            "(¬(p ∧ q) → (¬p ∨ ¬q)) ∧ ((¬p ∨ ¬q) → ¬(p ∧ q))",
            "((¬p → q) ∧ (r ∨ ¬q) ∧ (p → (a ∨ b)) ∧ (¬r ∧ ¬b)) → a"
    })
    void testSolutionValidExpressions(String expression) throws ParseException {
        boolean result = testSolution(expression);
        assertTrue(result, "Expression failed: " + expression);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "((¬p → q) ∧ (r ∨ ¬q) ∧ (p → (a ∨ b)) ∧ (¬r ∧ ¬b)) → a",
    })
    void testSolutionValidExpressionsSolo(String expression) throws ParseException {
        boolean result = testSolution(expression);
        assertTrue(result, "Expression failed: " + expression);
    }

    private static boolean testSolution(String expression) throws ParseException {
        Exp e = createExpression(expression);

        long currentTime = System.currentTimeMillis();

        TransitionGraph tg = new TransitionGraph(e);
        StateGraph sg = new StateGraph(tg, 20, 5000);

        System.out.printf("Time creating: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);

        currentTime = System.currentTimeMillis();

        if(sg.isSolvable()) {
            List<Solution> solutions = sg.findSolutions(1, new HashSet<>());

            int i = 1;
            for(Solution solution : solutions) {
                System.out.println("#"+i++);
                System.out.println(Utils.convertUnicodeEscapes(solution.toString()));
            }
        }

        System.out.println(Utils.convertUnicodeEscapes(expression));
        System.out.printf("Total finding solutions: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);


        return sg.isSolvable();
    }

}
