package tests;

import org.junit.Assert;
import org.junit.Test;

import main.Console;
import parser.ParseException;
import values.BoolValue;
import values.Value;


public class ParserTester {

    private void testCase(String expression) throws ParseException {
        Assert.assertNotNull(Console.accept(expression));
    }

    private void testNegativeCase(String expression) throws ParseException {
        Assert.assertNull(Console.accept(expression));
    }
    private void testCompare(String expression, Value expected) throws ParseException {
        Assert.assertTrue(Console.accept(expression).equals(expected));
    }

    @Test
    public void testsLogic() throws Exception {

        //Basic
        testCase("true\n");
        testCompare("true", new BoolValue(true));
        testCase("false\n");
        testNegativeCase("truer\n");
        testCase("true == true\n");
        testCompare("true || false", new BoolValue(true));
        testNegativeCase("true true\n");
        testNegativeCase("true == 1\n");
        testCase("1 == 2\n");
        testCase("2 == 2\n");
        testCase("2 == -2\n");
        testCompare("1 == 2 && 3 == 4\n", new BoolValue(false));
        testCase("true && (3 == (-4))\n");

        testNegativeCase("1 == 2 || 3 == 4 && xpto \n");
        testCompare("~(1 == 2) && true \n", new BoolValue(true));
        testCase("~(true) \n");
        testNegativeCase("~~(true) \n");
        testCompare("~(~(true)) \n", new BoolValue(true));
        testNegativeCase("< 11\n");
        testNegativeCase("11 >\n");
        testNegativeCase("<= 11\n");
        testNegativeCase("&& A\n");

        testCase("~(1 == 2) || false \n");
        testCompare("false || (3 < 2 && (4 == 4) || (3+4) == (2+5)) \n", new BoolValue(true));
    }

}









