package tests;

import java.util.Random;

public class RandLogic {

    public static String generateOperations(int numOperations, int numberBound) {
        Random random = new Random();

        String num = "(" + RandComparison.generateOperations(1, numberBound) + ")";
        if (random.nextBoolean())
            num = "true";
        if (random.nextBoolean())
            num = "false";

        if (numOperations <= 0)
            return num;

        String operator = generateRandomOperator(random);

        String result = generateOperations(numOperations - 1, numberBound) + " " + operator +" "+ num;

        if (random.nextBoolean())
            result = "~(" + result + ")";

        return result;
    }

    private static String generateRandomOperator(Random random) {
        String[] operators = {"&&", "||"};
        int index = random.nextInt(operators.length);
        return operators[index];
    }

}
