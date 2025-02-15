export const Rules = Object.freeze({
    INOT: '(¬<sub>I</sub>)',
    ENOT: '(¬<sub>E</sub>)',
    IAND: '(∧<sub>I</sub>)',
    ILOR: '(∨<sub>I<sub>l</sub></sub>)',
    IROR: '(∨<sub>I<sub>r</sub></sub>)',
    ELAND: '(∧<sub>E<sub>l</sub></sub>)',
    ERAND: '(∧<sub>E<sub>r</sub></sub>)',
    EOR: '(∨<sub>E<sub>r</sub></sub>)',
    EIMP: '(→<sub>E</sub>)',
    IIMP: '(→<sub>I</sub>)'
});

export class Rule {

    constructor(rule, antecedents = [], descentent = null) {
        this.rule = rule
        this.antecedents = antecedents
        this.descentent = descentent

        this.element = document.createElement('table')
        this.element.id = "tree"

        this.antecedents.forEach(element => { this.addAntecedent(element) });
        this.setRule(rule)
        this.setDescendent(descentent)

        this.element.object = this
    }

    #createRow(elements, id) {
        let row = document.createElement('tr')
        row.id = id

        elements.forEach(element => {
            let data = document.createElement('td')
            data.appendChild(element)
            row.appendChild(data)
        });

        this.element.append(row)
        return row
    }

    setRule(rule) {
        this.rule = rule

        let hr = document.createElement('hr')
        let text = document.createElement('text')
        text.innerHTML = rule;

        if (this.ruleRow) this.ruleRow.remove();
        this.ruleRow = this.#createRow([hr, text], "rule")
    }

    removeAntecedent(index) {
        let antecedent = this.antecedentsRow.children[index]
        if (antecedent) antecedent.remove()
    }

    addAntecedent(antecedent) {
        this.antecedents.push(antecedent)

        if (!this.antecedentsRow) this.antecedentsRow = this.#createRow([antecedent.getElement()], "antecedents")
        else this.antecedentsRow.firstElementChild.appendChild(antecedent.getElement())
    }

    setDescendent(descentent) {
        this.descentent = descentent

        if (!descentent) return

        if (this.descententRow) this.descententRow.remove();
        this.descententRow = this.#createRow([descentent.getElement()], "descentent")
    }

    merge(child, expression) {
        let target = !child.isDescendent() ? expression : child
        let targeted = child.isDescendent() ? expression : child

        let other = target.getParent().getElement();
        if (other && !other.contains(targeted.getElement())) {
            targeted.getElement().replaceWith(other);
            target.setCanBeAttached(false)

            if (target.getParent() != other.object)
                other.id = "subtree";
        }
    }

    unmerge(expression) {
        expression.setCanBeAttached(true)
        this.element.replaceWith(expression.getElement())

        this.setDescendent(expression.clone())

        this.element.id = "tree"
        document.body.appendChild(this.element)
    }

    getDescendent() { return this.descentent }
    getElement() { return this.element }

}