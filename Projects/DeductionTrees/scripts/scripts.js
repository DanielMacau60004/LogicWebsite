import { Expression, Premisse, Conclusion } from './tree/expressions.js';
import { Rule, Rules } from './tree/rules.js';

window.onload = function () {

    const premisse = new Premisse('ψ')
    const conclusion = new Conclusion('φ ∨ ψ');
    const rule1 = new Rule(Rules.IIMP, [new Expression('a')], new Expression('(a ∧ a) → a'));
    const rule2 = new Rule(Rules.EOR, [new Expression('a ∨ a'),new Expression('a'), new Expression('b') ], new Expression('a'));
    const rule3 = new Rule(Rules.ELAND, [new Expression('a ∧ b')], new Expression('b'));

    //document.body.appendChild(premisse.getElement())
    document.body.appendChild(rule1.getElement())
    document.body.appendChild(rule2.getElement())
    document.body.appendChild(rule3.getElement())
    document.body.appendChild(rule4.getElement())
    document.body.appendChild(rule5.getElement())
    document.body.appendChild(rule6.getElement())
    //document.body.appendChild(conclusion.getElement())
};

