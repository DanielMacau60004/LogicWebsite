package logic.algorithm.implementation;

import logic.algorithm.implementation.state.ParallelStateGraph;
import logic.algorithm.implementation.state.StateGraph;
import logic.algorithm.implementation.transition.TransitionGraph;
import logic.ast.Exp;
import logic.ast.logic.ASTImplication;
import logic.ast.types.ASTVariable;
import logic.interpreter.FOLFreeInterpreter;
import logic.interpreter.FOLReplaceVariables;
import logic.interpreter.FOLTermsInterpreter;
import logic.parser.ExpressionsParser;
import logic.parser.ParseException;
import logic.utils.Utils;
import org.junit.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.io.ByteArrayInputStream;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class AlgoFOLTests {

    public static Exp createExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return parser.parseFOL();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            /*1*/"∀x P(x) ∨ ∀x Q(x). ∀x (P(x) ∨ Q(x))",
            /*2*/"∀x (P(x) ∧ Q(x)). ∀x P(x) ∧ ∀x Q(x)",
            /*3*/"(∀x P(x) ∧ ∀x Q(x)) → ∀x (P(x) ∧ Q(x))",
            /*4*/"∃x (P(x) ∧ Q(x)). ∃x P(x) ∧ ∃x Q(x)",
            /*5*/"(∃x P(x) ∨ ∃x Q(x)) → ∃x (P(x) ∨ Q(x))",
            /*6*/"∃x (P(x) ∨ Q(x)). ∃x P(x) ∨ ∃x Q(x)",
            /*7*/"∀x (P(x) → Q(x)). ∀x P(x) → ∀x Q(x)",
            /*8*/"∃y∀x φ. ∀x∃y φ",
            /*9*/"∃x ¬P(x) → ¬∀x P(x)",
            /*10*/"¬∀x P(x) → ∃x ¬P(x)",
            /*11*/"∀x ¬P(x) → ¬∃x P(x)",
            /*12*/"¬∃x P(x) → ∀x ¬P(x)",
            /*13*/"∃x φ → ¬∀x ¬φ",
            /*14*/"¬∀x ¬φ. ∃x φ",
            /*15*/"∀x φ → ¬∃x ¬φ",
            /*17*///"((∀x φ ∧ ψ) → ∀x (φ ∧ ψ)) ∧ (∀x (φ ∧ ψ) → (∀x φ ∧ ψ))", //Only works if we add x in the set of notfree
            /*23*///"(∀x (φ → ψ) → (∃x φ → ψ)) ∧ ((∃x φ → ψ) → ∀x (φ → ψ))", //Only works if we add x in the set of notfree

            /*2*/"∀y(C(y) ∨ D(y)). ∀x(C(x) → L(x)). ∃x¬L(x). ∃x D(x)",
            /*3*/"∀x(C(x) → S(x)). ∀x(¬A(x,b) → ¬S(x)). ∀x((C(x)∨S(x)) → A(x,b))",
            /*4*///"L(a,b). ∀x(∃y(L(y,x) ∨ L(x,y)) → L(x,x)). ∃x L(x,a)", //Is not computable
            /*5*/"∀x ∀y (L(x,y) → L(y,x)). ∃x ∀y L(x,y). ∀x ∃y L(x,y)", //Require aux variables but is computable
    })
    void testFOL(String premissesAndExpression) throws ParseException {
        String[] parts = premissesAndExpression.split("\\.");
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
            "∀x P(x). P(x)",
            "P(x). ∃x P(x)",
            "φ. φ",
            "∀x (P(x) → Q(x)). P(x). Q(x)",
            "∀x (P(x) → Q(x)). P(x). ∃x Q(x)",

            "∀x (P(x) → Q(x)).P(a). Q(a)",
            "∀x (P(x) → Q(x)).P(a). ∃x Q(x)",
            "∀y (P(y) → Q(y)). ∀y P(y). ∀x Q(x)",

            "¬∃x ¬P(x). ∀x P(x)",
            "∀y (C(y) ∨ D(y)). ∀x (C(x) → L(x)). ∃x ¬L(x). ∃x D(x)",
            "∀x (∀y P(x,y)). ∀y (∀x P(y,x))",
            "∀x (P(x) → Q(x)).P(a). ∃x Q(x)",
            "∃x ¬P(x) → ¬∀x P(x)",
            "¬∃x P(x) → ∀x ¬P(x)",
    })
    void testOthers(String premissesAndExpression) throws ParseException {
        String[] parts = premissesAndExpression.split("\\.");
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
            //"∀x (D(x) → S(x,a)). S(a,c). ∀x ∀y ∀z ((S(x,y) ∧ S(y,z)) → S(x,z)). ∀x (D(x) → S(x,c))"

            //"∀x ∀y (L(x,y) → L(y,x)). ∃x ∀y L(x,y). ∀x ∃y L(x,y)"
            //"∀x (∀y P(x,y)). ∀y (∀x P(y,x))",
            //"∃x (P(x) ∧ Q(x)). ∃x P(x) ∧ ∃x Q(x)",
            //"A → (A ∨ B)",
            //"∃x Par(x). ∀x (Par(x) → Par(sq(x))). ∀x Par(sq(x))",
            //"P(a). Q(x). ∃x (P(x) ∧ Q(x))",
            //"∀x ∀y(R(x,y) → R(y,x)). ∀x ∀y ∀z((R(x,y) ∧ R(y,z)) → R(x,z)). ∀x ¬∀y ¬R(x,y)." +
            //        " ∀x R(x,x)"
            //"∀x ¬∀y(P(x, y) → Q(x,y)). ∀x ∃y P(x, y)"
            //"L(a,b). ∀x(∃y(L(y,x) ∨ L(x,y)) → L(x,x)). ∃x L(x,a)",
            "L(a,b). ∀x(∃y(L(y,x) ∨ L(x,y)) → L(x,x)). ∃x L(x,a)"

            //"∀x (∀y P(x,y)). ∀y (∀x P(y,x))"
    })
    void testSingleFOL(String premissesAndExpression) throws ParseException {
        String[] parts = premissesAndExpression.split("\\.");
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
        StateGraph sg = new ParallelStateGraph(tg, 10, 1000);
        System.out.println(Utils.convertUnicodeEscapes(tg));

        System.out.printf("Time creating: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);
        System.out.println("Solvable: " + sg.isSolvable());
        System.out.println(Utils.convertUnicodeEscapes(sg));

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

    @Test
    public void test() throws ParseException {
        ASTImplication e = (ASTImplication) createExpression("∀x P(x, x, y) → ∀x Q(x)");


        System.out.println(Utils.convertUnicodeEscapes(FOLTermsInterpreter.getTerms(e)));
        System.out.println(Utils.convertUnicodeEscapes(FOLTermsInterpreter.getTerms(e.left)));
        System.out.println(Utils.convertUnicodeEscapes(FOLTermsInterpreter.getTerms(e.right)));

    }

}
