package typechecker;

import java.util.List;
import java.util.stream.Collectors;

public class TypeError extends Exception implements Comparable<TypeError> {

    private final int line;
    private final int col;

    public TypeError(String message, int line, int col) {
        super(message);
        this.line = line;
        this.col = col;
    }

    public int getLine() {
        return line;
    }

    public int getCol() {
        return col;
    }

    @Override
    public int compareTo(TypeError o) {
        int cmd = Integer.compare(line , o.line);
        if(cmd == 0)
            return Integer.compare(col, o.col);
        return cmd;
    }
}
