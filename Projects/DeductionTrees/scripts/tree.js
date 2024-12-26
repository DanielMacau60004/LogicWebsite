
export function createTree(rule) {
    createTreeAux(document.body, true, rule);
}

var lastTree;

function createTreeAux(target, tree, rule) {
    var div = document.createElement('div');

    if (tree) div.id = "tree";
    else div.id = "branch";

    var table = document.createElement('table');
    setPremisses(rule, table, div);
    setRule(rule, table);
    setConclusion(rule, tree, table, div);

    div.appendChild(table);
    target.appendChild(div);

}

function setPremisses(rule, table, div) {
    var row = document.createElement('tr');
    var cell = document.createElement('td');

    for (const premisse of rule.getPremisses()) {
        if (premisse instanceof Rule) {
            createTreeAux(cell, false, premisse)
        } else {
            var premisseDiv = document.createElement('div');
            premisseDiv.id = "leaf";
            premisseDiv.classList.add('appendable');
            premisseDiv.innerHTML = premisse;
            cell.append(premisseDiv);
            movableElement(premisseDiv, div);
        }
    }

    row.appendChild(cell);
    table.appendChild(row);
}

function setRule(rule, table) {
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    var hr = document.createElement('hr');
    cell.appendChild(hr);
    row.appendChild(cell);

    var cell = document.createElement('td');
    cell.innerHTML = rule.getRule();
    row.appendChild(cell);
    table.appendChild(row);
}

function setConclusion(rule, tree, table, div) {
    var row = document.createElement('tr');
    var cell = document.createElement('td');

    var conclusionDiv = document.createElement('div');
    conclusionDiv.id = "root";

    if (tree)
        conclusionDiv.classList.add('appendable');
    conclusionDiv.innerHTML = rule.getValue();
    cell.append(conclusionDiv);
    movableElement(conclusionDiv, div);
    row.appendChild(cell); table.appendChild(row);
}


function movableElement(child, parent) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    child.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (!child.classList.contains("appendable"))
            return;

        parent = findLastTree(child);
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        parent.classList.add('dragging');

        document.onmouseup = closeMovableElement;
        document.onmousemove = elementDrag;
        document.ondblclick = elementSlip;

        if (lastTree != null) lastTree.classList.remove("selected");
        lastTree = findLastTree(e.target);
        lastTree.classList.add("selected");

        const allDivs = document.querySelectorAll('.appendable');
        allDivs.forEach(div => {
            if (!parent.contains(div) && child.id != div.id && child.innerHTML === div.innerHTML)
                div.classList.add("highlightmerging");
        });

}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    var newTop = parent.offsetTop - pos2;
    var newLeft = parent.offsetLeft - pos1;

    parent.style.top = newTop + "px";
    parent.style.left = newLeft + "px";

    checkForMerge(child);
}

function closeMovableElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    parent.classList.remove('dragging');

    const allDivs = document.querySelectorAll('.appendable');
    allDivs.forEach(div => {

        if (div !== parent) {
            if (isHover(child, div) && child.id != div.id && child.innerHTML === div.innerHTML) {

                if (child.id == "root") {
                    let other = findLastTree(parent);

                    if (!other.contains(div)) {
                        div.replaceWith(other);
                        other.id = "branch";
                        child.classList.remove('merging');
                        child.classList.remove('appendable');
                        child.classList.add('unappendable');
                    }
                } else {
                    let other = findLastTree(div);

                    if (!other.contains(child)) {
                        child.replaceWith(other);
                        other.id = "branch";
                        div.classList.remove('merging');
                        div.classList.remove('appendable');
                        div.classList.add('unappendable');
                    }
                }

                return
            }
        } 
    });

    document.querySelectorAll('.highlightmerging').forEach(div => {div.classList.remove("highlightmerging");});
}

function elementSlip(e) {
    let div = e.target;
    if (!div.classList.contains("unappendable"))
        return;
    e.preventDefault();

    div.classList.add('appendable');
    div.classList.remove('unappendable');

    let parent = findFirstTree(div);
    let clone = parent.cloneNode(true);
    clone.id = "tree";

    parent.replaceWith(div);
    document.body.appendChild(clone);
    div.id = "leaf";

    clone.querySelectorAll(".appendable, .unappendable").forEach(e => {
        movableElement(e, clone);
    });
}

function checkForMerge(parent) {
    const allDivs = document.querySelectorAll('.appendable');
    allDivs.forEach(div => {
        if (div !== parent) {
            if (isHover(parent, div) && parent.id != div.id && parent.innerHTML === div.innerHTML) {
                div.classList.add('merging');
                return;
            }
            else div.classList.remove('merging');
        }
    });
}

function isHover(parent, div) {
    const rect1 = parent.getBoundingClientRect();
    const rect2 = div.getBoundingClientRect();
    return rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top
}
}

function findLastTree(component) {
    let currentElement = component;
    let lastRootParent = null;

    while (currentElement) {
        if (currentElement.id === 'tree' || currentElement.id === 'branch')
            lastRootParent = currentElement;

        currentElement = currentElement.parentElement;
    }

    return lastRootParent;
}

function findFirstTree(component) {
    let currentElement = component;

    while (currentElement) {
        if (currentElement.id === 'tree' || currentElement.id === 'branch')
            return currentElement;
        currentElement = currentElement.parentElement;
    }

    return null;
}

