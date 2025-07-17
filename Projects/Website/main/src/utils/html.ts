export function supSubStr(str: string, sup: string, sub: string): string {
    return `${str}<span class='rule-substitution'><sup>${sup}</sup><sub>${sub}</sub></span>`;
}

export function supStr(str: string, sup: string): string {
    return `${str}<span class='rule-substitution'><sup>${sup}</sup></span>`;
}

export function subStr(str: string, sub: string): string {
    return `${str}<span class='rule-substitution'><sub>${sub}</sub></span>`;
}
