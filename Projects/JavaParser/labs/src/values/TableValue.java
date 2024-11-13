package values;

import java.util.*;
import java.util.function.Consumer;
import java.util.function.Function;

public class TableValue implements Value {

    SortedSet<String> literals = new TreeSet<>();
    Map<String, BoolValue> rows = new TreeMap<>();


    public TableValue(String literal) {
        literals.add(literal);
        rows.put("1", new BoolValue(true));
        rows.put("0", new BoolValue(false));
    }

    public TableValue(TableValue table1, Function<BoolValue, BoolValue> operation) {
        literals.addAll(table1.literals);

        Map<String, Integer> indexes = new TreeMap<>();

        int index = 0;
        for (String literal : literals)
            indexes.put(literal, index++);

        iterateCombinations((map -> {
            StringBuilder result = new StringBuilder();

            for (String lit : table1.literals)
                result.append(map.charAt(indexes.get(lit)));

            //Apply operation
            BoolValue transResult = operation.apply(table1.getResult(result.toString()));
            rows.put(map, transResult);
        }));

    }

    public String getLiteralByIndex(int index) {
        int i = 0;
        for (String literal : literals) {
            if (i == index)
                return literal;
            i++;
        }
        return null;
    }

    /*
    public BoolValue getValue(String literal, String row) {
        row.charAt(literals.)
    }*/

    public TableValue(TableValue table1, TableValue table2, Function<Pair<BoolValue>, BoolValue> operation) {
        literals.addAll(table1.literals);
        literals.addAll(table2.literals);

        Map<String, Integer> indexes = new LinkedHashMap<>();

        int index = 0;
        for (String literal : literals)
            indexes.put(literal, index++);

        iterateCombinations((map -> {
            StringBuilder result1 = new StringBuilder();
            StringBuilder result2 = new StringBuilder();

            for (String lit : table1.literals)
                result1.append(map.charAt(indexes.get(lit)));
            for (String lit : table2.literals)
                result2.append(map.charAt(indexes.get(lit)));

            //Apply operation
            rows.put(map, operation.apply(new Pair<>(
                    table1.getResult(result1.toString()), table2.getResult(result2.toString()))
            ));
        }));

    }

    private BoolValue getResult(String input) {
        return rows.get(input);
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        for (String lit : literals)
            str.append(" ").append(lit).append(" |");
        str.append(" Result\n");
        for (String ignored : literals)
            str.append("---+");
        str.append("------\n");

        for (String map : rows.keySet()) {
            str.append(" ");
            for (int i = 0; i < map.length(); i++)
                str.append(map.charAt(i) == '1' ? "T" : "F").append(" | ");
            str.append(rows.get(map).getValue() ? "T" : "F");
            str.append("\n");
        }

        return str.toString();
    }

    private void iterateCombinations(Consumer<String> method) {
        int n = literals.size();
        int rows = (int) Math.pow(2, n);

        for (int i = 0; i < rows; i++) {
            String binaryString = String.format("%" + n + "s", Integer.toBinaryString(i)).replace(' ', '0');
            method.accept(binaryString);
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof TableValue otherTable) {

            int[] indexes = new int[literals.size()];
            for(int i = 0; i< indexes.length; i++)
                indexes[i]=i;

            List<int[]> permutations = new ArrayList<>();
            permute(permutations, indexes, 0, literals.size());

            for (int[] perm : permutations) {
                boolean result = true;

                for (String line : rows.keySet()) {
                    StringBuilder permLine = new StringBuilder();
                    for (int index : perm)
                        permLine.append(line.charAt(index));

                    if (!rows.get(line).equals(otherTable.getResult(permLine.toString()))) {
                        result = false;
                        break;
                    }
                }
                if (result) //Found an equivalence
                    return true;

            }
        }

        return false;
    }

    private static void permute(List<int[]> permutations, int[] arr, int index, int n) {
        if (index == n) {
            permutations.add(arr.clone());
            return;
        }
        for (int i = index; i < n; i++) {
            swap(arr, index, i);
            permute(permutations, arr, index + 1, n);
            swap(arr, index, i); // backtrack
        }
    }

    private static void swap(int[] array, int i, int j) {
        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    public class Pair<T> {
        private T left;
        private T right;

        public Pair(T left, T right) {
            this.left = left;
            this.right = right;
        }

        public T getLeft() {
            return left;
        }

        public T getRight() {
            return right;
        }
    }

}
