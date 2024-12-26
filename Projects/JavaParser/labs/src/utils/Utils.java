package utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

    public static String convertUnicodeEscapes(String input) {
        Pattern pattern = Pattern.compile("\\\\u([0-9A-Fa-f]{4})");
        Matcher matcher = pattern.matcher(input);

        StringBuffer result = new StringBuffer();

        while (matcher.find()) {
            String hexCode = matcher.group(1);
            int codePoint = Integer.parseInt(hexCode, 16);
            matcher.appendReplacement(result, String.valueOf((char) codePoint));
        }

        matcher.appendTail(result);
        return result.toString();
    }

}
