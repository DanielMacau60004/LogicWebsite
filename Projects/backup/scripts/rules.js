export const Symbols = Object.freeze({
    CONJUNCTION: "∧",
    DISJUNCTION: "∨",
    IMPLICATION: "→"
});

export const Rules = Object.freeze({
    IAND: '(' + Symbols.CONJUNCTION + '<sub>I</sub>)',
    ELAND: '(' + Symbols.CONJUNCTION + '<sub>E<sub>l</sub></sub>)',
    ERAND: '(' + Symbols.CONJUNCTION + '<sub>E<sub>r</sub></sub>)',
    EIMP: '(' + Symbols.IMPLICATION + '<sub>E</sub>)'
});

export class Rule {
    constructor(premisses, conclusion, rule) {
        this.premisses = premisses;
        this.conclusion = conclusion;
        this.rule = rule;
    }

    getValue() { return this.conclusion; }
    getPremisses() { return this.premisses; }
    getRule() { return this.rule; }
}
