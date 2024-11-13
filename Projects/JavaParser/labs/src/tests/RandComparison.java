package tests;

import java.util.Random;

public class RandComparison {

    public static String generateOperations(int numOperations, int numberBound) {
        Random random = new Random();

        String num = "(";//TODO +RandArithmetic.generateOperations(2, numberBound)+")";
        if (numOperations <= 0)
            return num;

        String operator = generateRandomOperator(random);

        return generateOperations(numOperations - 1, numberBound) + " " + operator + " " + num;
    }

    private static String generateRandomOperator(Random random) {
        String[] operators = {"==", ">", "<", ">=", "<="};
        int index = random.nextInt(operators.length);
        return operators[index];
    }

}
