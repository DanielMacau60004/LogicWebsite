package main;
import java.util.*;

public class Test {

    public static void main(String[] args) {
        int[] input = {0,1, 2};
        Set<String> permutations = new HashSet<>();
        generatePermutations(input, 0, permutations);
        for (String perm : permutations) {
            System.out.println(perm);
        }
    }

    private static void generatePermutations(int[] array, int index, Set<String> permutations) {
        if (index == array.length - 1) {
            permutations.add(arrayToString(array));
            return;
        }

        for (int i = index; i < array.length; i++) {
            swap(array, index, i);
            generatePermutations(array, index + 1, permutations);
            swap(array, index, i); // backtrack
        }
    }

    private static void swap(int[] array, int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    private static String arrayToString(int[] array) {
        StringBuilder sb = new StringBuilder();
        for (int num : array) {
            sb.append(num);
        }
        return sb.toString();
    }

}
