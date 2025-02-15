var selectedElement = null

export function movableExpression(child) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

    var childElement = child.getElement()
    var parentElement = null
    var highlighted = []
    var dragging = false;

    childElement.onmousedown = dragMouseDown

    function select(expression) {
        selectedElement = expression
        selectedElement.classList.add("selected")
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        if (!child.isMovable()) return;

        parent = child.getParent()
        parentElement = parent.getElement()

        pos3 = e.clientX;
        pos4 = e.clientY;

        parentElement.classList.add('dragging');

        document.onmouseup = closeMovableElement;
        document.onmousemove = elementDrag;
        document.ondblclick = elementDblClick;

        if (selectedElement) selectedElement.classList.remove("selected");
        select(parent.getElement())

        setTimeout(function() {
            if(dragging) highlight();
        }, 50);
        dragging = true
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
    
        const contentElement = document.getElementById("content");
        const screenWidth = contentElement.offsetWidth;
        const screenHeight = contentElement.offsetHeight;
        

        //alert(screenWidth+" " + screenHeight);
    
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
    
        var newTopPx = parentElement.offsetTop - pos2;
        var newLeftPx = parentElement.offsetLeft - pos1;
    
        var newTopPercent = (newTopPx / screenHeight) * 100;
        var newLeftPercent = (newLeftPx / screenWidth) * 100;
    
        parentElement.style.top = newTopPercent + "%";
        parentElement.style.left = newLeftPercent + "%";

        checkForMerge();
    }

    function elementDblClick(e) {
        e = e || window.event;
        e.preventDefault();

        let expressionElement = e.target
        if (expressionElement.id !== "expression" || expressionElement.classList.contains("attachable")) inputValue(expressionElement)
        else elementSlip(expressionElement)
    }

    function inputValue(expressionElement) {
        expressionElement.focus()
    }

    function elementSlip(expressionElement) {
        let parent = expressionElement.object.getFirstParent()
        parent.unmerge(expressionElement.object)
    }

    function closeMovableElement() {
        document.onmouseup = null
        document.onmousemove = null

        parentElement.classList.remove('dragging')

        applyMerge()
        dragging = false
        highlighted.forEach(expressionElement => { expressionElement.classList.remove("highlight"); })
    }

    function highlight() {
        document.querySelectorAll('.attachable').forEach(expressionElement => {
            if (!parentElement.contains(expressionElement) && canMerge(child, expressionElement.object))
                expressionElement.classList.add("highlight");
            highlighted.push(expressionElement)
        });
    }

    function applyMerge() {
        document.querySelectorAll('.attachable').forEach(expressionElement => {
            if (isHover(childElement, expressionElement) && canMerge(child, expressionElement.object)) {
                parent.merge(child, expressionElement.object)
                parent.getElement().querySelectorAll('.merging')
                    .forEach(div => { div.classList.remove("merging"); });
                return
            }
        });
    }

    function checkForMerge() {
        document.querySelectorAll('.attachable').forEach(expressionElement => {
            if (isHover(childElement, expressionElement) && canMerge(child, expressionElement.object)) {
                expressionElement.classList.add('merging')
                return;
            }
            else expressionElement.classList.remove('merging')
        });
    }

    function canMerge(child, expression) {
        return child.getValue() === expression.getValue() && child.isDescendent() != expression.isDescendent();
    }

    function isHover(parent, div) {
        const rect1 = parent.getBoundingClientRect()
        const rect2 = div.getBoundingClientRect()
        return parent !== div && rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top
    }
}