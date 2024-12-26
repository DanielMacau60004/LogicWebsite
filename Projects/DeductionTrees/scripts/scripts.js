import { Expression, Premisse, Conclusion } from './tree/expressions.js';
import { Rule, Rules } from './tree/rules.js';

window.onload = function () {

    const premisse = new Premisse('ψ')
    const conclusion = new Conclusion('φ ∨ ψ');
    const rule1 = new Rule(Rules.IAND, [new Expression('φ'), new Premisse('ψ')], new Expression('φ ∨ ψ'));
    const rule2 = new Rule(Rules.ERAND, [new Expression('φ'), new Premisse('ψ')], new Expression('φ'));
    const rule3 = new Rule(Rules.ELAND, [new Premisse('φ ∨ ψ')], new Expression('φ'));
    const rule4 = new Rule(Rules.ELAND, [new Premisse('φ ∨ ψ')], new Expression('φ'));
    const rule5 = new Rule(Rules.ERAND, [new Expression('φ1'), new Expression('ψ')], new Expression('φ2'));
    const rule6 = new Rule(Rules.ELAND, [new Expression('φ3'), new Expression('ψ1')], new Expression('ψ'));

    //document.body.appendChild(premisse.getElement())
    document.body.appendChild(rule1.getElement())
    document.body.appendChild(rule2.getElement())
    document.body.appendChild(rule3.getElement())
    document.body.appendChild(rule4.getElement())
    document.body.appendChild(rule5.getElement())
    document.body.appendChild(rule6.getElement())
    //document.body.appendChild(conclusion.getElement())
};

