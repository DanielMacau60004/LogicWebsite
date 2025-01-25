package algorithm;

import ast.Exp;
import ast.logic.*;
import ast.symbols.ASTParenthesis;
import ast.symbols.ASTSequence;
import parser.ExpressionsParser;
import parser.ParseException;
import utils.Utils;

import java.io.ByteArrayInputStream;
import java.util.*;
import java.util.stream.Collectors;

public class Test {

    static final Exp BOT = new ASTLiteral("⊥");

    public static Exp createExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return ((ASTSequence) parser.parseProp()).sequence.get(0);
    }

    public static Exp removeParenthesis(Exp exp) {
        if (exp instanceof ASTParenthesis par)
            exp = par.exp;
        return exp;
    }

    public static void main(String[] args) throws ParseException {
        // First set of exercises
        //Exp e = createExpression("a → (a ∨ b)"); //HAS SOLUTIONS
        //Exp e = createExpression("(a ∨ a) → a");
        //Exp e = createExpression("(a ∧ b) → a"); //HAS SOLUTIONS
        //Exp e = createExpression("a → (b → a)"); //HAS SOLUTIONS
        //Exp e = createExpression("((a → b) ∧ (b → c)) → (a → c)");
        //Exp e = createExpression("(a → (b → c)) → ((a → b) → (a → c))");
        //Exp e = createExpression("(a → b) → (a → (b ∨ c))"); //HAS SOLUTIONS
        //Exp e = createExpression("(b → c) → ((a ∧ b) → c)");
        //Exp e = createExpression("¬(a ∨ b) → ¬a");
        //Exp e = createExpression("(b → c) → ((a ∧ b) → (a ∧ c))");

        //Exp e = createExpression("(a → (a ∨ b)) ∧ (a → (a ∨ b))");

        // Second set of exercises
        //Exp e = createExpression("¬a → (a → b)"); //HAS SOLUTIONS
        //Exp e = createExpression("((a → b) ∧ ¬b) → ¬a");
        //Exp e = createExpression("(a → ¬¬a) ∧ (¬¬a → a)");
        //Exp e = createExpression("((a → b) → (¬b → ¬a)) ∧ ((¬b → ¬a) → (a → b))"); //Has errors
        //Exp e = createExpression("a ∨ ¬a"); //HAS SOLUTIONS
        //Exp e = createExpression("((a → d) → a) → a");
        //Exp e = createExpression("a ∨ (a → b)"); //HAS SOLUTIONS
        //Exp e = createExpression("(a → b) ∨ (b → d)"); //HAS SOLUTIONS

        //TODO As premissas tem de ser usadas para regenerar o grafo!
        List<Exp> premisses = new ArrayList<>();
        //premisses.add(createExpression("b"));

        Graph<Exp, Exp> graph = new Graph<>();
        genBottomUp(graph, e);

        Set<Exp> nodes = new HashSet<>(graph.graph.keySet());
        for (Exp n : nodes)
            genTopDown(graph, n);

        System.out.println(Utils.convertUnicodeEscapes(graph.toString()));

        List<List<Exp>> solutions = graph.findSolutions(e, 12,premisses);
        System.out.println("Found " + solutions.size() + " solutions: ");
        //for(List<Exp> solution : solutions)
        //    System.out.println(Utils.convertUnicodeEscapes(solution.toString()));

        List<List<Exp>> topSolutions = solutions.stream()
                .sorted(Comparator.comparingInt(List::size))
                .limit(10)
                .collect(Collectors.toList());

        for (int i = 0; i < topSolutions.size(); i++) {
            List<Exp> solution = topSolutions.get(i);
            System.out.println(Utils.convertUnicodeEscapes(
                    "Solution " + (i + 1) + " has " + solution.size() + " steps: " + solution));
        }
    }

    private static void genBottomUp(Graph<Exp, Exp> graph, Exp e) {
        e = removeParenthesis(e);

        Exp neg = new ASTNot(e instanceof ASTLiteral ? e : new ASTParenthesis(e));
        graph.addEdge(e, BOT, null, neg);
        graph.addEdge(BOT, e, neg, null);

        if (e instanceof ASTOr or) {
            genBottomUp(graph, or.left);
            genBottomUp(graph, or.right);
            graph.addEdge(e, removeParenthesis(or.left), null, null);
            graph.addEdge(e, removeParenthesis(or.right), null, null);
        } else if (e instanceof ASTImplication imp) {
            genBottomUp(graph, imp.right);
            graph.addEdge(e, removeParenthesis(imp.right), null, removeParenthesis(imp.left));
            graph.addEdge(removeParenthesis(imp.right), e, removeParenthesis(imp.left), null);
        }

    }

    private static void genTopDown(Graph<Exp, Exp> graph, Exp e) {
        e = removeParenthesis(e);

        if (e instanceof ASTOr or) {
            genTopDown(graph, or.left);
            genTopDown(graph, or.right);
            graph.addEdge(e, removeParenthesis(or.left), null, null);
            graph.addEdge(e, removeParenthesis(or.right), null, null);
        } else if (e instanceof ASTImplication imp) {
            genTopDown(graph, imp.left);
            genTopDown(graph, imp.right);
            graph.addEdge(removeParenthesis(imp.right), imp, removeParenthesis(imp.left), null);
        } else  if (e instanceof  ASTAnd and) {
            genTopDown(graph, and.left);
            genTopDown(graph, and.right);
            graph.addEdge(removeParenthesis(and.left), e, null, null);
            graph.addEdge(removeParenthesis(and.right), e, null, null);
        }

    }

}
