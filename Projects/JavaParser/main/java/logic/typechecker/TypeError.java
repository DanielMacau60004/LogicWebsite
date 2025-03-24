package logic.typechecker;

public class TypeError extends Exception implements Comparable<TypeError> {

    private final int line;
    private final int col;

    public TypeError(String message) {
        super(message);
        this.line = 0;
        this.col = 0;
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
