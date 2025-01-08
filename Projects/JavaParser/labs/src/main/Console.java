package main;

import java.io.*;
import java.util.Map;
import java.util.Scanner;

import ast.Exp;
import ast.horn.*;
import ast.symbols.ASTDelPred;
import ast.symbols.ASTSequence;
import parser.ParseException;
import parser.ExpressionsParser;
import parser.TokenMgrError;

import interpreter.*;
import symbols.Env;
import typechecker.FOLTypeChecker;
import typechecker.PropTypeChecker;
import typechecker.TypeCheckerError;
import utils.Utils;
import values.Value;

public class Console {

    public static void main(String[] args) {

        String file = System.getProperty("user.dir") + "/labs/src/main/code.logic";

        ExpressionsParser parser = new ExpressionsParser(RunFile.readFile(file));
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                System.out.println("Executing program:");
                System.out.println("  File: " + file);

                //Exp e = parser.parseProp();
                //PropTypeChecker.checker(e);
                //PropInterpreter.interpret(e);

                Exp e = parser.parseFOL();
                FOLTypeChecker.checker(e);

                //System.out.println(Utils.convertUnicodeEscapes(e.toString()));

                ASTSequence seq = (ASTSequence) e;

                //TODO temporary
                for(Exp exp : seq.sequence) {
                    if(exp instanceof ASTDelPred) continue;
                    System.out.println("##############");
                    System.out.println(Utils.convertUnicodeEscapes(exp.toString()));
                    Map<String, Exp> hornClauses = HornClauses.interpret(exp);
                    System.out.println("CLAUSES: " + Utils.convertUnicodeEscapes(hornClauses.get("CLAUSES").toString()));
                    System.out.println("##############");
                }

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
        ExpressionsParser parser = new ExpressionsParser(new ByteArrayInputStream(s.getBytes()));
        try {
            Exp e = parser.parseProp();
            PropTypeChecker.checker(e);
            Value value = PropInterpreter.interpret(e);
            System.out.println("Interpreter: " + value);
            return value;
        } catch (Exception e) {
            return null;
        }
    }


}
