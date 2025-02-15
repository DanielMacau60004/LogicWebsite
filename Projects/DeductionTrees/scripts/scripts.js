import { Expression, Premisse, Conclusion } from './tree/expressions.js';
import { Rule, Rules } from './tree/rules.js';


const env = document.getElementById("content");

window.onload = function () {

    const premisse = new Premisse('ψ')
    const conclusion = new Conclusion('φ ∨ ψ');

    const rule1 = new Rule(Rules.IIMP, [new Expression('¬ψ')], new Expression('¬(φ ∨ ψ) → ¬ψ'));
    const rule2 = new Rule(Rules.INOT, [new Expression('⊥')], new Expression('¬ψ'));
    const rule3 = new Rule(Rules.ENOT, [new Expression('¬(φ ∨ ψ)'), new Expression('φ ∨ ψ')], new Expression('⊥'));
    const rule4 = new Rule(Rules.ILOR, [new Expression('ψ')], new Expression('φ ∨ ψ'));
    const rule5 = new Rule(Rules.IROR, [new Expression('ψ ∧ φ')], new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'));
    const rule6 = new Rule(Rules.ILOR, [new Expression('ψ ∧ 𝛾')], new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'));
    const rule7 = new Rule(Rules.ELAND, [new Expression('ψ ∧ (φ ∨ 𝛾)')], new Expression('φ ∨ 𝛾'));
    const rule8 = new Rule(Rules.EOR, [new Expression('φ ∨ 𝛾'), new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'), new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)')], 
    new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)'));
    const rule9 = new Rule(Rules.IIMP, [new Expression('(ψ ∧ φ) ∨ (ψ ∧ 𝛾)')], new Expression('(ψ ∧ (φ ∨ 𝛾)) → ((ψ ∧ φ) ∨ (ψ ∧ 𝛾))'));
    

    //document.body.appendChild(premisse.getElement())
    env.appendChild(rule1.getElement())
    env.appendChild(rule2.getElement())
    env.appendChild(rule3.getElement())
    env.appendChild(rule4.getElement())
    //env.appendChild(rule5.getElement())
    //env.appendChild(rule6.getElement())
    //env.appendChild(rule7.getElement())
    //env.appendChild(rule8.getElement())
    //env.appendChild(rule9.getElement())
    
    
    //document.body.appendChild(conclusion.getElement())
};

document.getElementById("btnAdd1").onclick = function() {
    env.appendChild(new Rule(Rules.ERAND, [new Expression('  ')], new Expression('  ')).getElement())
}

document.getElementById("btnAdd2").onclick = function() {
    env.appendChild(new Rule(Rules.ERAND, [new Expression('  '), new Expression('  ')], new Expression('  ')).getElement())
}

document.getElementById("btnAdd3").onclick = function() {
    env.appendChild(new Rule(Rules.ERAND, [new Expression('  '), new Expression('  '), new Expression('  ')], new Expression('  ')).getElement())
}

