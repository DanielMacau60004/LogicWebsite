import { Expression, Premisse, Conclusion } from './tree/expressions.js';
import { Rule, Rules } from './tree/rules.js';

window.onload = function () {

    const premisse = new Premisse('ψ')
    const conclusion = new Conclusion('φ ∨ ψ');

    const rule1 = new Rule(Rules.ERAND, [new Expression('ψ ∧ (φ ∨ 𝛾)')], new Expression('ψ'));
    const rule2 = new Rule(Rules.ERAND, [new Expression('ψ ∧ (φ ∨ 𝛾)')], new Expression('ψ'));
    const rule3 = new Rule(Rules.IAND, [new Expression('ψ'), new Expression('φ')], new Expression('ψ ∧ φ'));
    const rule4 = new Rule(Rules.IAND, [new Expression('ψ'), new Expression('𝛾')], new Expression('ψ ∧ 𝛾'));
    const rule5 = new Rule(Rules.IROR, [new Expression('ψ ∧ φ')], new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'));
    const rule6 = new Rule(Rules.ILOR, [new Expression('ψ ∧ 𝛾')], new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'));
    const rule7 = new Rule(Rules.ELAND, [new Expression('ψ ∧ (φ ∨ 𝛾)')], new Expression('φ ∨ 𝛾'));
    const rule8 = new Rule(Rules.EOR, [new Expression('φ ∨ 𝛾'), new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'), new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)')], 
    new Expression('ψ ∨ (φ ∨ 𝛾)'));
    const rule9 = new Rule(Rules.IIMP, [new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)')], new Expression('(ψ ∧ (φ ∨ 𝛾)) → ((ψ ∧ φ) ∨ (ψ ∧ 𝛾))'));
    
    //document.body.appendChild(premisse.getElement())
    document.body.appendChild(rule1.getElement())
    document.body.appendChild(rule2.getElement())
    document.body.appendChild(rule3.getElement())
    document.body.appendChild(rule4.getElement())
    document.body.appendChild(rule5.getElement())
    document.body.appendChild(rule6.getElement())
    document.body.appendChild(rule7.getElement())
    document.body.appendChild(rule8.getElement())
    document.body.appendChild(rule9.getElement())
    //document.body.appendChild(conclusion.getElement())
};

