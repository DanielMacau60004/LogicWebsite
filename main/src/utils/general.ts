
export const forceInputChange = (input: HTMLInputElement, newText: string) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
    )?.set;

    nativeInputValueSetter?.call(input, newText);
    const event = new Event('input', {bubbles: true});
    input.dispatchEvent(event);
};


export function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}