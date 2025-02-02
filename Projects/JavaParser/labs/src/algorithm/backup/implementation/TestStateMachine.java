package algorithm.backup.implementation;

import ast.Exp;
import ast.symbols.ASTSequence;
import parser.ExpressionsParser;
import parser.ParseException;
import utils.Utils;

import java.io.ByteArrayInputStream;
import java.util.List;

public class TestStateMachine {

    public static Exp createExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return ((ASTSequence) parser.parseProp()).sequence.get(0);
    }

    public static void main(String[] args) throws ParseException {
        String[] expressions = {
                "a → a", // WORKING
                "a → (a ∨ b)", // WORKING
                //"(a ∨ a) → a", // NOT WORKING
                //"(a ∧ b) → a", // WORKING
                //"a → (b → a)", // WORKING
                //"¬a → (a → b)", // WORKING
                //"¬(a ∨ b) → ¬a", // WORKING
                //"(b → c) → ((a ∧ b) → (a ∧ c))", // NOT WORKING
                //"((a → b) ∧ ¬b) → ¬a", // NOT WORKING
                //"a ∨ (a → b)", // WORKING
                //"(a → b) ∨ (b → d)" // WORKING
                //"(a → ¬(¬a)) ∧ (¬(¬a) → a)"
        };

        for (String expression : expressions) {
            testSolution(expression, 20, 5, true, true);
            System.out.println();
        }

    }

    private static void testSolution(String expression, int solutionSize, int solutionLimit,
                                     boolean printGraph, boolean printSolutions) throws ParseException {
        Exp e = createExpression(expression);

        StateMachine sm = new StateMachine(e);

        long currentTime = System.currentTimeMillis();

        System.out.println(Utils.convertUnicodeEscapes(expression));
        if (printGraph) {
            System.out.println("#############################################");
            System.out.println(Utils.convertUnicodeEscapes(sm.toString()));
        }

        List<Solution> solutions = sm.solve(e, solutionSize, solutionLimit);
        System.out.println("Found " + solutions.size() + " solutions:");

        if (printSolutions) {
            for (Solution solution : solutions)
                System.out.println(Utils.convertUnicodeEscapes(solution.toString()));
            System.out.println("#############################################");
        }

        System.out.printf("Total time: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);
    }

}
