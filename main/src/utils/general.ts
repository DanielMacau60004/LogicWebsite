
export const forceInputChange = (input: HTMLInputElement, newText: string) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
    )?.set;

    nativeInputValueSetter?.call(input, newText);
    const event = new Event('input', {bubbles: true});
    input.dispatchEvent(event);
};

export const forceDivChange = (div: HTMLDivElement, newText: string) => {
    div.innerText = newText;

    const event = new Event('input', { bubbles: true });
    div.dispatchEvent(event);
};


export function deepCopy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function numberToHexColor(num: number): string {
    const baseHue = 240;
    const hueStep = 137;
    const hue = (baseHue + (num - 1) * hueStep) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}
