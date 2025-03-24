package logic.algorithm.implementation;

import logic.algorithm.implementation.state.ParallelStateGraph;
import logic.algorithm.implementation.state.StateGraph;
import logic.algorithm.implementation.transition.TransitionGraph;
import logic.ast.Exp;
import logic.ast.symbols.ASTSequence;
import org.junit.jupiter.params.provider.ValueSource;
import logic.parser.ExpressionsParser;
import logic.parser.ParseException;
import logic.utils.Utils;

import org.junit.jupiter.params.ParameterizedTest;

import java.io.ByteArrayInputStream;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertNotNull;


public class AlgoPLTests {

    public static Exp createExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return parser.parsePL();
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
            "((a → b) ∧ ¬b) → ¬a",
            "a ∨ (a → b)",
            "(a → b) ∨ (b → d)",
            "(a → ¬(¬a)) ∧ (¬(¬a) → a)",
            "((a → b) ∧ (b → c)) → (a → c)",
            "(b → c) → ((a ∧ b) → c)",
            "(a → (b → c)) → ((a → b) → (a → c))",
            "((a → b) → (¬b → ¬a)) ∧ ((¬b → ¬a) → (a → b))",
            "a ∨ ¬a",
            "((a → d) → a) → a",
            "¬(¬(¬p)) → ¬p",
            "⊥ → a",
            "(¬(¬a ∨ ¬b)) → (a ∧ b)",
            "((a → b) ∧ (b → a)) → (((a ∧ c) → (b ∧ c)) ∧ ((b ∧ c) → (a ∧ c)))",
            "(p ∨ q) → (q ∨ p)",
            "(p ∨ q) → (p ∨ (q ∨ p))",
            "((p ∨ q) ∨ r) → (p ∨ (q ∨ r))",
            "(¬p ∨ ¬q) → ¬(p ∧ q)",
            "((p ∨ q) ∨ (r ∨ s)) → ((p ∨ s) ∨ (r ∨ q))",
            "(¬(p ∧ q) → (¬p ∨ ¬q)) ∧ ((¬p ∨ ¬q) → ¬(p ∧ q))",
            "((a ∨ b) ∧ (a ∨ c)) → (a ∨(b ∧ c))",
            "(¬(¬a ∨ ¬b)) → (a ∧ b)",
            "(a ∨ a) → a"
    })
    void testRandomExercises(String expression) throws ParseException {
        Solution solution = testSolution(expression, new HashSet<>());
        assertNotNull(solution, "No solutions found!");
    }

    @ParameterizedTest
    @ValueSource(strings = {"¬¬¬p → ¬p"})
    void test(String premissesAndExpression) throws ParseException {
        String[] parts = premissesAndExpression.split(",");
        String expression = parts[parts.length - 1].trim();

        Set<Exp> premisses = new HashSet<>();
        for (int i = 0; i < parts.length - 1; i++) {
            premisses.add(createExpression(parts[i].trim()));
        }

        Solution solution = testSolution(expression, premisses);
        assertNotNull(solution, "No solutions found!");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "a → (a ∨ b)",
            "(a ∨ a) → a",
            "(a ∧ b) → a",
            "a → (b → a)",
            "((a → b) ∧ (b → c)) → (a → c)",
            "(a → (b → c)) → ((a → b) → (a → c))",
            "(a → b) → (a → (b ∨ c))",
            "(b → c) → ((a ∧ b) → c)",
            "¬(a ∨ b) → ¬a",
            "(b → c) → ((a ∧ b) → (a ∧ c))",

            "¬a → (a → b)",
            "((a → b) ∧ ¬b) → ¬a",
            "a ↔ ¬¬a",
            "(a → b) ↔ (¬b → ¬a)",
            "⊥ → a",
            //"⊤",
            "a ∨ ¬a",
            "((a → d) → a) → a",
            "a ∨ (a → b)",
            "(a → b) ∨ (b → d)",

            "¬a ∨ b, a → b",
            "a → b, ¬a ∨ b",
            "¬(a ∧ b), ¬a ∨ ¬b",
            "¬a ∨ ¬b, ¬(a ∧ b)",
            "¬(a ∨ b), ¬a ∧ ¬b",
            "¬a ∧ ¬b, ¬(a ∨ b)",
            "a ∨ (b ∧ c), (a ∨ b) ∧ (a ∨ c)",
            "(a ∨ b) ∧ (a ∨ c), a ∨ (b ∧ c)",
            "a ∧ (b ∨ c), (a ∧ b) ∨ (a ∧ c)",
            "(a ∧ b) ∨ (a ∧ c), a ∧ (b ∨ c)",
            "a ↔ b, (a ∧ c) ↔ (b ∧ c)",
            "¬(¬a ∨ ¬b), a ∧ b"
    })
    void testPracticalExercises(String premissesAndExpression) throws ParseException {
        String[] parts = premissesAndExpression.split(",");
        String expression = parts[parts.length - 1].trim();

        Set<Exp> premisses = new HashSet<>();
        for (int i = 0; i < parts.length - 1; i++) {
            premisses.add(createExpression(parts[i].trim()));
        }

        Solution solution = testSolution(expression, premisses);
        assertNotNull(solution, "No solutions found!");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            // 4.2 Conjunction
            "p, q, p ∧ q",
            "(a ∧ b) ∧ c, b",
            "p ∧ q, q ∧ p",
            "q ∧ p, r, p ∧ (r ∧ q)",
            "a ∧ b, (c ∧ d) ∧ r, (a ∧ d) ∧ r",
            "p ∧ (q ∧ r), (r ∧ p) ∧ q",

            // 4.3 Implication
            "p → p",
            "p → (q → p)",
            "p → q, q → r, p → r",
            "p → ((p → q) → q)",
            "(p → q) → (p → r), q → (p → r)",
            "(p → q) → p, q → p",
            "p → (q → r), q → (p → r)",
            "p → (q → r), p → q, p → r",
            "(p → p) → q, (q → r) → r",
            "(p → (q → r)) → ((p → q) → (p → r))",

            // Mixed problems with conjunction
            "p ∧ q, p → q",
            "(p ∧ q) → p",
            "p → (q ∧ r), p → q",
            "((p ∧ q) → q) → (q → p), q → p",
            "(p ∧ q) → r, p → (q → r)",
            "(p → q) ∧ (p → r), p → (q ∧ r)",
            "p → (q ∧ r), (p → q) ∧ (p → r)",

            // 4.4 Disjunction
            "p ∨ q, q ∨ p",
            "p ∨ q, p ∨ (q ∨ r)",
            "(p ∨ q) ∨ r, p ∨ (q ∨ r)",
            "(p ∨ q) ∨ (r ∨ a), (p ∨ a) ∨ (r ∨ q)",

            // Mixed problems with conjunction
            "p ∧ (q ∨ r), (p ∧ q) ∨ (p ∧ r)",
            "(p ∨ q) ∧ (p ∨ r), p ∨ (q ∧ r)",
            "(p ∧ q) ∨ (p ∧ r), p ∧ (q ∨ r)",
            "p ∨ (q ∧ r), (p ∨ q) ∧ (p ∨ r)",

            // Mixed problems with implication
            "(p → q) ∨ q, p → q",
            "p ∨ q, (p → q) → q",
            "(p → q) → (p → r), (p ∨ r) → (q → r)",
            "(p → q) ∨ (p → r), p → (q ∨ r)",

            // Mixed problems with conjunction and implication
            "(p → q) ∧ (q → p), (p ∨ q) → (p ∧ q)",
            "(p ∨ q) → (p ∧ q), (p → q) ∧ (q → p)",
            "(q → r) ∧ (q ∨ p), (p → q) → (r ∧ q)",

            // 4.5 Biconditional
            "p ↔ q, q ↔ p",
            "p, (p ↔ q) ↔ r, q ↔ r",
            "(p ↔ q) ↔ (q ↔ p)",

            // Mixed problems
            "(p ∨ q) ↔ q, p → q",
            "(p ∧ q) ↔ p, p → q",
            "p → q, (p ∨ q) ↔ q",
            "p → q, (p ∧ q) ↔ p",
            "(p → q) ∧ (q → p), p ↔ q",
            "(p ∧ q) → ((p → q) → p)",
            "((p → q) ↔ p) → (p ↔ q)",
            "((p ∨ q) ↔ q) ↔ p, p ↔ q",
            "p → (q ↔ r), (p ∧ q) ↔ (p ∧ r)",
            "(p ∨ (q ∧ r)) ↔ ((p ∨ q) ∧ (p ∨ r))",

            // 4.6 Negation
            "p, ¬¬p",
            "¬p, ¬(p ∧ q)",
            "p → ¬p, ¬p",
            "¬(p → q), ¬q",
            "¬(p ∧ q), p → ¬q",
            "p → q, ¬q → ¬p",
            "¬((p ∧ ¬p) ∨ (q ∧ ¬q))",
            "¬(p ∨ q), ¬p ∧ ¬q",
            "¬p ∨ ¬q, ¬(p ∧ q)",

            // Ex falso quodlibet
            "¬p, p → q",
            "p ∧ ¬p, q",
            "p ∨ q, ¬p → q",
            "p → q, p ∧ ¬q, r",
            "p ∨ q, p ↔ q, ¬(p ∧ q), r",

            // Indirect proofs
            "¬¬p, p",
            "p ∨ ¬p",
            "¬(¬p ∨ ¬q), p ∧ q",
            "¬(p ∧ q), ¬p ∨ ¬q",

            // Mixed problems
            "¬(p → q), p",
            "(p → q) → p, p",
            "p ↔ ¬¬q, p ↔ q",
            "(p → q) → q, ¬q → p",
            "¬p ∧ ¬q, ¬(p ∨ q)",
            "p ∨ (p → q)",
            "(p → q) ∨ (q → r)",
            "¬p → q, r ∨ ¬q, p → (a ∨ b), ¬r ∧ ¬b, a",
            "p → (q ∨ r), (p → q) ∨ (p → r)",
            "¬(p ∧ q) ↔ (¬p ∨ ¬q)"
    })
    void testLogicalExercises(String premissesAndExpression) throws Exception {
        String[] parts = premissesAndExpression.split(",");
        String expression = parts[parts.length - 1].trim();

        Set<Exp> premisses = new HashSet<>();
        for (int i = 0; i < parts.length - 1; i++) {
            premisses.add(createExpression(parts[i].trim()));
        }

        Solution solution = testSolution(expression, premisses);
        assertNotNull(solution, "No solutions found!");
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "(p → (q → r)) → ((p → q) → (p → r))"
    })
    void testBig(String premissesAndExpression) throws ParseException {
        String[] parts = premissesAndExpression.split(",");
        String expression = parts[parts.length - 1].trim();

        Set<Exp> premisses = new HashSet<>();
        for (int i = 0; i < parts.length - 1; i++) {
            premisses.add(createExpression(parts[i].trim()));
        }

        Solution solution = testSolution(expression, premisses);
        assertNotNull(solution, "No solutions found!");
    }



    private static Solution testSolution(String expression, Set<Exp> premisses) throws ParseException {
        Exp e = createExpression(expression);

        long currentTime = System.currentTimeMillis();

        TransitionGraph tg = new TransitionGraph(e, premisses);
        StateGraph sg = new ParallelStateGraph(tg, 20, 2000);
        System.out.println(sg);

        System.out.printf("Time creating: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);
        System.out.println("Solvable: " + sg.isSolvable());

        //System.out.println(Utils.convertUnicodeEscapes(tg));

        currentTime = System.currentTimeMillis();

        Solution solution = sg.findSolution();
        if (solution != null) {
            System.out.println("Size: " + solution.size());
            System.out.println("Depth: " + solution.depth());
            System.out.println();
            System.out.println(Utils.convertUnicodeEscapes(solution));
        }

        System.out.println(Utils.convertUnicodeEscapes(expression));
        System.out.printf("Time solving: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);
        return solution;
    }

}

