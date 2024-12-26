package values;

import ast.Exp;

import java.util.*;
import java.util.function.Function;

public class TableValue implements Value {

    private static final String PIPE = " | ";
    private static final String DASH = "---+";
    private static final String TRUE = "T";
    private static final String FALSE = "F";
    private static final String LINE_BREAK = "--------";

    private final String exp;
    private final SortedSet<String> literals;
    private final BoolValue[] results;

    TableValue(String exp, SortedSet<String> literals, BoolValue[] results) {
        this.exp = exp;
        this.literals = new TreeSet<>(literals);
        this.results = results;
    }

    public TableValue(String exp, BoolValue value) {
        this.exp = exp;
        this.literals = new TreeSet<>();
        this.results = new BoolValue[]{value};
    }

    public TableValue(String exp, String literal) {
        this.exp = exp;
        this.literals = new TreeSet<>();
        this.literals.add(literal);
        this.results = new BoolValue[]{new BoolValue(false), new BoolValue(true)};
    }

    private BoolValue queryValue(int combination, SortedSet<String> others) {
        return results[queryIndex(combination, others)];
    }

    private int queryIndex(int combination, SortedSet<String> others) {
        int c = 0;
        int i = literals.size() - 1;

        int position = others.size() - 1;
        for (String literal : others) {
            int bitValue = (combination >> position) & 1;

            if (literals.contains(literal)) {
                c += (int) Math.pow(2, i) * bitValue;
                i--;
            }
            position--;
        }

        return c;
    }

    public TableValue transform(String exp, Function<BoolValue, BoolValue> operation) {
        final SortedSet<String> literals = new TreeSet<>(this.literals);
        final BoolValue[] results = new BoolValue[this.results.length];

        for (int i = 0; i < results.length; i++)
            results[i] = operation.apply(this.results[i]);

        return new TableValue(exp, literals, results);
    }

    public TableValue transform(String exp, TableValue table, Function<Pair<BoolValue>, BoolValue> operation) {
        final SortedSet<String> literals = new TreeSet<>(this.literals);
        literals.addAll(table.literals);

        int size = (int) Math.pow(2, literals.size());
        final BoolValue[] results = new BoolValue[size];

        for (int i = 0; i < size; i++) {
            BoolValue left = this.queryValue(i, literals);
            BoolValue right = table.queryValue(i, literals);
            results[i] = operation.apply(new Pair<>(left, right));
        }

        return new TableValue(exp, literals, results);
    }

    public TableValue shorten(SortedSet<String> literals) {
        if (this.literals.equals(literals))
            return this;

        final BoolValue[] results = new BoolValue[Math.max(1, literals.size())];

        for (int i = 0; i < this.results.length; i++) {
            int oldIndex = queryIndex(i, literals);
            BoolValue value = this.results[i];
            BoolValue oldValue = this.results[oldIndex];

            if (oldValue != null && !oldValue.equals(value))
                return null;
            results[oldIndex] = value;
        }

        return new TableValue(exp, literals, results);
    }

    public List<BoolValue> getResults() {
        return Arrays.stream(results).toList();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof TableValue otherTable) {

            SortedSet<String> intersection = new TreeSet<>(literals);
            intersection.retainAll(otherTable.literals);

            //Same size tables
            TableValue left = shorten(intersection);
            TableValue right = otherTable.shorten(intersection);

            if (left == null || right == null)
                return false;

            for (int i = 0; i < left.results.length; i++)
                if (!left.results[i].equals(right.results[i]))
                    return false;

            return true;
        }
        return false;
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder(" ");

        for (String lit : literals)
            str.append(lit).append(PIPE);
        str.append(exp).append("\n");

        for (String ignored : literals)
            str.append(DASH);
        str.append(LINE_BREAK).append("\n");

        int n = literals.size();
        for (int i = 0; i < results.length; i++) {
            str.append(" ");

            if (!literals.isEmpty()) {
                String binary = String.format("%" + n + "s", Integer.toBinaryString(i))
                        .replace(" ", FALSE + PIPE)
                        .replace("0", FALSE + PIPE)
                        .replace("1", TRUE + PIPE);
                str.append(binary);
            }

            str.append(results[i].getValue() ? TRUE : FALSE);
            str.append("\n");
        }

        return str.toString();
    }

    public record Pair<T>(T left, T right) {
    }

}
