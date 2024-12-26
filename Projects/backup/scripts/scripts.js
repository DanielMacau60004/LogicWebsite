import { Rule, Rules, Symbols } from './rules.js';
import { createTree } from './tree.js';

window.onload = function () {
    const rule3 = new Rule(["φ " + Symbols.CONJUNCTION + " ψ"], "ψ", Rules.ELAND);
    const rule4 = new Rule(["φ", "φ " + Symbols.IMPLICATION + " ψ"], "ψ", Rules.EIMP);
    const rule5 = new Rule(["φ", "ψ"], "φ " + Symbols.CONJUNCTION + " ψ", Rules.IAND);
    const rule6 = new Rule(["φ", "φ " + Symbols.IMPLICATION + " ψ"], "φ " + Symbols.CONJUNCTION + " ψ", Rules.IAND);
    const rule7 = new Rule(["φ", "φ " + Symbols.CONJUNCTION + " ψ", "ψ"], "φ " + Symbols.CONJUNCTION + " ψ", Rules.IAND);

    createTree(rule3);
    createTree(rule5);
    createTree(rule3);
    createTree(rule3);
    createTree(rule4);
    createTree(rule5);
    createTree(rule5);
    createTree(rule6);
    createTree(rule7);
    createTree(rule7);
    createTree(rule6);
};