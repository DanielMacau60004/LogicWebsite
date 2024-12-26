package main;

import java.io.*;
import java.util.Scanner;

import ast.Exp;
import parser.ParseException;
import parser.Parser;
import parser.TokenMgrError;

import interpreter.*;
import typechecker.PropTypeChecker;
import typechecker.TypeCheckerError;
import utils.Utils;
import values.Value;

public class Console {

    public static void main(String[] args) {

        String file = System.getProperty("user.dir") + "/labs/src/main/code.logic";

        Parser parser = new Parser(RunFile.readFile(file));
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                System.out.println("Executing program:");
                System.out.println("  File: " + file);

                Exp e = parser.Start();
                PropTypeChecker.checker(e);
                PropInterpreter.interpret(e);

                //System.out.println(Utils.convertUnicodeEscapes(e.toString()));

            } catch (TokenMgrError e) {
                System.out.println("Lexical Error!");
                System.out.println(Utils.convertUnicodeEscapes(e.getMessage()));
            } catch (ParseException | TypeCheckerError e) {
                System.out.println("Syntax Error!");
                System.out.println(Utils.convertUnicodeEscapes(e.getMessage()));
            }

            scanner.nextLine();
            parser.ReInit(RunFile.readFile(file));
        }

    }

    public static Value accept(String s) throws ParseException {
        Parser parser = new Parser(new ByteArrayInputStream(s.getBytes()));
        try {
            Exp e = parser.Start();
            PropTypeChecker.checker(e);
            Value value = PropInterpreter.interpret(e);
            System.out.println("Interpreter: " + value);
            return value;
        } catch (Exception e) {
            return null;
        }
    }


}
