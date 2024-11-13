package main;

import ast.Exp;
import compiler.CodeGen;
import interpreter.Interpreter;
import parser.ParseException;
import parser.Parser;
import typechecker.TypeChecker;
import typechecker.TypeCheckerError;
import values.Value;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class RunFile {

    public static void runCode(Parser parser) throws TypeCheckerError, ParseException, FileNotFoundException {
        long startTime = System.currentTimeMillis();

        Exp e = parser.Start();
        TypeChecker.checker(e);

        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
        String formattedDate = dateFormat.format(date);

        System.out.printf("###################[%s]###################\n", formattedDate);
        Interpreter.interpret(e);

        System.out.println("\n###########################################################");
        long endTime = System.currentTimeMillis();
        executionTime(endTime - startTime);
        System.out.println("###########################################################");
    }

    private static void executionTime(long executionTime) {
        long minutes = (executionTime / 1000) / 60;
        long seconds = (executionTime / 1000) % 60;
        long milliseconds = executionTime % 1000;

        System.out.println("Execution time: " + minutes + " mins " + seconds + " secs " + milliseconds + " ms");
    }

    public static ByteArrayInputStream readFile(String filePath) {
        StringBuilder contentBuilder = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new FileReader(
                filePath.replace("/", "\\")))) {
            String line;
            while ((line = br.readLine()) != null) {
                contentBuilder.append(line).append("\n");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new ByteArrayInputStream(contentBuilder.toString().getBytes());
    }

}
