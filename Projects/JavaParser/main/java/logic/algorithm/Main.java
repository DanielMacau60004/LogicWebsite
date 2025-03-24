package logic.algorithm;

import logic.algorithm.implementation.Solution;
import logic.algorithm.implementation.state.ParallelStateGraph;
import logic.algorithm.implementation.state.StateGraph;
import logic.algorithm.implementation.transition.TransitionGraph;
import logic.ast.Exp;
import logic.ast.symbols.ASTSequence;
import logic.parser.ExpressionsParser;
import logic.parser.ParseException;
import logic.utils.Utils;

import java.awt.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Main {

    public static void main(String[] args) {
        try {
            PrintStream fileOut = new PrintStream(new FileOutputStream("output.txt"), true, StandardCharsets.UTF_8);
            System.setOut(fileOut);

            // If no file is provided, print usage and return
            if (args.length == 0) {
                System.out.println("Usage: java MainClass <file>");
                return;
            }

            // Reading from the provided file
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(new FileInputStream(args[0]), StandardCharsets.UTF_8)
            );
            String line;
            List<String> lines = new ArrayList<>();

            // Read all lines into a list
            while ((line = reader.readLine()) != null) {
                lines.add(line.trim());
            }
            reader.close();

            int heightLimit = 20;
            int nodesLimit = 1000;

            int example = 1;
            for (String currentLine : lines) {
                if(currentLine.isEmpty() || currentLine.startsWith("#"))
                    continue;

                String[] cline = currentLine.split("=");

                Exp expression = null;
                Set<Exp> premisses = new HashSet<>();
                Exp initialExp = null;
                Set<Exp> hypotheses = new HashSet<>();

                if(cline.length > 0) {
                    String[] first = cline[0].split(",");

                    for (int i = 0; i < first.length - 1; i++)
                        premisses.add(createExpression(first[i].trim()));
                    expression = createExpression(first[first.length - 1].trim());
                }

                if(cline.length > 1) {
                    String[] first = cline[1].split(",");
                    for (int i = 0; i < first.length - 1; i++)
                        hypotheses.add(createExpression(first[i].trim()));
                    initialExp = createExpression(first[first.length - 1].trim());

                }

                // Test solution
                System.out.println("#############################################");
                System.out.println("EXAMPLE: " + example);

                testSolution(expression, premisses, heightLimit, nodesLimit, initialExp, hypotheses);
                example++;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Exp createExpression(String expression) throws ParseException {
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream((expression + ".").getBytes()));
        return parser.parsePL();
    }

    private static void testSolution(Exp expression, Set<Exp> premisses,
                                     int heightLimit, int nodesLimit, Exp initialExp, Set<Exp> hypotheses) throws ParseException {

        long currentTime = System.currentTimeMillis();

        TransitionGraph tg = new TransitionGraph(expression, premisses);
        StateGraph sg = new ParallelStateGraph(tg, heightLimit, nodesLimit);

        System.out.println(sg);
        System.out.printf("Time creating: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);
        System.out.println("Solvable: " + sg.isSolvable());

        //System.out.println(Utils.convertUnicodeEscapes(tg));

        currentTime = System.currentTimeMillis();

        Solution solution = initialExp == null ? sg.findSolution() : sg.findSolution(initialExp, hypotheses);
        if (solution != null) {
            System.out.println("Size: " + solution.size());
            System.out.println("Depth: " + solution.depth());
            System.out.println();
            System.out.println(Utils.convertUnicodeEscapes(solution));
        }

        System.out.printf("Time solving: %.3f seconds%n", (System.currentTimeMillis() - currentTime) / 1000.0);

    }
}
