package main;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import ast.Exp;
import compiler.CodeGen;
import parser.ParseException;
import parser.Parser;
import parser.TokenMgrError;

import interpreter.*;
import typechecker.TypeChecker;
import typechecker.TypeCheckerError;
import values.Value;

public class Console {

    //file <interpreter> <compiler>
    public static void main(String[] args) {
        Map<String, String> properties = extractKeyValues(args);

        String file = properties.get("file");
        if (file == null)
            file = System.getProperty("user.dir") + "/labs/src/main/code.eml";

        Parser parser = new Parser(RunFile.readFile(file));
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                System.out.println("Executing program:");
                System.out.println("  File: " + file);

                Exp e = parser.Start();
                TypeChecker.checker(e);

                //System.out.println(e.proof());
                Interpreter.interpret(e);

            } catch (TokenMgrError e) {
                System.out.println("Lexical Error!");
                e.printStackTrace();
            } catch (ParseException | TypeCheckerError e) {
                System.out.println("Syntax Error!");
                e.printStackTrace();
            }

            scanner.nextLine();
            parser.ReInit(RunFile.readFile(file));
        }

    }

    public static Value accept(String s) throws ParseException {
        Parser parser = new Parser(new ByteArrayInputStream(s.getBytes()));
        try {
            Exp e = parser.Start();
            TypeChecker.checker(e);
            Value value = Interpreter.interpret(e);
            System.out.println("Interpreter: " + value);
            return value;
        } catch (Exception e) {
            return null;
        }
    }

    public static Map<String, String> extractKeyValues(String[] args) {
        String regex = "(\\w+)=\"([^\"]*)\"|(\\w+)=(\\S+)";
        Pattern pattern = Pattern.compile(regex);
        Map<String, String> map = new HashMap<>();

        for (String i : args) {
            Matcher matcher = pattern.matcher(i);
            if (matcher.matches()) {
                String[] split = i.split("=");
                map.put(split[0], split[1]);
            }
        }
        return map;
    }

}
