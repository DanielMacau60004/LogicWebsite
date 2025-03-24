package logic.main;

import java.io.*;
import java.util.Map;
import java.util.Scanner;

import logic.ast.Exp;
import logic.ast.horn.HornClauses;
import logic.ast.symbols.ASTDelPred;
import logic.ast.symbols.ASTSequence;
import logic.interpreter.PropInterpreter;
import logic.parser.ParseException;
import logic.parser.ExpressionsParser;
import logic.parser.TokenMgrError;

import logic.typechecker.FOLTypeChecker;
import logic.typechecker.PropTypeChecker;
import logic.typechecker.TypeCheckerError;
import logic.utils.Utils;
import logic.values.Value;

public class Console {

    public static void main(String[] args) {

        String file = System.getProperty("user.dir") + "/main/java/logic/main/code.logic";

        ExpressionsParser parser = new ExpressionsParser(RunFile.readFile(file));
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                System.out.println("Executing program:");
                System.out.println("  File: " + file);

                Exp e = parser.parsePL();
                PropTypeChecker.checker(e);
                PropInterpreter.interpret(e);

                //Exp e = parser.parseFOL();
                //FOLTypeChecker.checker(e);

                //System.out.println(Utils.convertUnicodeEscapes(e.toString()));

                ASTSequence seq = (ASTSequence) e;

                //TODO temporary
                /*for(Exp exp : seq.sequence) {
                    if(exp instanceof ASTDelPred) continue;
                    System.out.println("##############");
                    System.out.println(Utils.convertUnicodeEscapes(exp.toString()));
                    Map<String, Exp> hornClauses = HornClauses.interpret(exp);
                    System.out.println("CLAUSES: " + Utils.convertUnicodeEscapes(hornClauses.get("CLAUSES").toString()));
                    System.out.println("##############");
                }*/

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
            Exp e = parser.parsePL();
            PropTypeChecker.checker(e);
            Value value = PropInterpreter.interpret(e);
            System.out.println("Interpreter: " + value);
            return value;
        } catch (Exception e) {
            return null;
        }
    }


}
