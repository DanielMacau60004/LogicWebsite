import { movableExpression } from './events.js';

function transformExpression(expression) {
    let transformed = expression.replace(/\band\b/g, '∧')
        .replace(/\bor\b/g, '∨')
        .replace(/->/g, '→');

    transformed = transformed.replace(/\s+/g, ' ');
    transformed = transformed.replace(/([a-zA-Z0-9])([∧∨→])/g, '$1 $2')
        .replace(/([∧∨→])([a-zA-Z0-9])/g, '$1 $2');

    return transformed;
}

export class Expression {

    constructor(value, canBeAttached = true, editable = true) {
        this.element = document.createElement('input')
        this.element.type = "text"
        this.element.value = value
        this.element.style.width = (value.length + 1) + 'ch';
        this.element.disabled = !editable
        this.element.id = "expression"
        this.element.object = this
        this.element.addEventListener('input', function () {
            this.value = transformExpression(this.value)
            this.style.width = (this.value.length + 1) + 'ch';
        });
        this.element.addEventListener('blur', function () {
            this.value = this.value.trim();
        });

        this.setCanBeAttached(canBeAttached)
        movableExpression(this)
    }

    setCanBeAttached(canBeAttached) {
        this.canBeAttached = canBeAttached
        if (canBeAttached) this.element.classList.add('attachable')
        else this.element.classList.remove('attachable')
    }

    getParent() {
        let currentElement = this.element;
        let lastRootParent = currentElement;

        while (currentElement) {
            if (currentElement.id === 'tree' || currentElement.id === 'subtree')
                lastRootParent = currentElement;
            currentElement = currentElement.parentElement;
        }

        return lastRootParent.object;
    }

    getFirstParent() {
        let currentElement = this.element;

        while (currentElement) {
            if (currentElement.id === 'tree' || currentElement.id === 'subtree')
                return currentElement.object;
            currentElement = currentElement.parentElement;
        }

        return null;
    }

    isDescendent() { 
        let parent = this.getFirstParent()
        return parent && parent.getDescendent() == this
     }

    isAntecendent() {
        return !this.isDescendent()
    }

    isMovable() { return this.canBeAttached }
    getValue() { return this.element.value }
    getElement() { return this.element }

    clone() { return new Expression(this.getValue(), this.canBeAttached) }

}

export class Conclusion extends Expression {
    constructor(value) { super(value, true, false) }

    isDescendent() { return false }
    clone() { return new Conclusion(this.value) }
}

export class Premisse extends Expression {
    constructor(value) { super(value, false, true) }

    clone() { return new Premisse(this.value) }
}
