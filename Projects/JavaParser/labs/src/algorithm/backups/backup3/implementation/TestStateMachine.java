package algorithm.backups.backup3.implementation;

import ast.Exp;
import ast.symbols.ASTSequence;
import parser.ExpressionsParser;
import parser.ParseException;
import utils.Utils;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
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
                "(a ∨ a) → a", // NOT WORKING OR RULE
                "(a ∧ b) → a", // WORKING
                "a → (b → a)", // WORKING
                "¬a → (a → b)", // WORKING
                "¬(a ∨ b) → ¬a", // WORKING
                "(b → c) → ((a ∧ b) → (a ∧ c))", // WORKING
                "((a → b) ∧ ¬b) → ¬a", // NOT WORKING MULTI-BRANCHING NO BOT
                "a ∨ (a → b)", // WORKING
                "(a → b) ∨ (b → d)", // WORKING
                "(a → ¬(¬a)) ∧ (¬(¬a) → a)", // WORKING IF WE FIX ¬¬a TO ¬(¬a)
                "((a → b) ∧ (b → c)) → (a → c)", // WORKING
                "(b → c) → ((a ∧ b) → c)", // WORKING
                "(a → (b → c)) → ((a → b) → (a → c))", // WORKING
                "((a → b) → (¬b → ¬a)) ∧ ((¬b → ¬a) → (a → b))", // WORKING
                "a ∨ ¬a", // WORKING
                "((a → d) → a) → a", // WORKING
                "¬(¬(¬p)) → ¬p", // WORKING
                "⊥ → a", // WORKING
        };

        List<String> succeeded  = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        for (String expression : expressions) {
            boolean result = testSolution(expression, 20, 5, true, true);
            if (result) succeeded.add(expression);
            else failed.add(expression);
            System.out.println();
        }

        System.out.println("Succeeded: " + succeeded.size());
        succeeded.forEach(System.out::println);
        System.out.println("Failed: " + failed.size());
        failed.forEach(System.out::println);
    }

    private static boolean testSolution(String expression, int solutionSize, int solutionLimit,
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

        return !solutions.isEmpty();
    }

}
