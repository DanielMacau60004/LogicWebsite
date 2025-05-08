export function replaceUnicodeEscapes(input: string) {
    input = input.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) =>
        String.fromCodePoint(parseInt(hex, 16))
    );

    input = input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
    );

    return input;
}
