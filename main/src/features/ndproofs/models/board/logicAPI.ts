import {Board, ComponentType, ExpComponent, RuleComponent, TreeComponent} from "../../types/proofBoard";
import {Components} from "../components/logic";

export function convertTreeToAPIFormat(board: Board, tree: TreeComponent): string {
    if(Components.isASimpleTree(tree))
        return convertExpToAPIFormat(board, board.components[tree.conclusion] as ExpComponent)

    let str = ""
    //Render rule
    str+= convertRuleToAPIFormat(board, tree)

    str += "["
    //Render conclusion
    str += convertExpToAPIFormat(board, board.components[tree.conclusion] as ExpComponent)

    //Render hypotheses
    str += tree.hypotheses ? tree.hypotheses.map(key=>{
        const leaf = board.components[key]
        if(leaf.type === ComponentType.TREE) return convertTreeToAPIFormat(board, leaf as TreeComponent)
        else return convertExpToAPIFormat(board, leaf as ExpComponent)
    }).join(" ") : ""

    str += "]"

    return str
}

export function convertRuleToAPIFormat(board: Board, tree: TreeComponent): string {
    if (tree.rule === undefined) return ""

    const rule = board.components[tree.rule] as RuleComponent
    const marks = tree.marks ? tree.marks.map(id => ", " + board.components[id].value).join("") : ""
    return "[" + rule.value + marks + "]"
}

export function convertExpToAPIFormat(board: Board, exp: ExpComponent): string {
    const mark = (Components.isLeaf(board, exp) && exp.mark) ? board.components[exp.mark].value : undefined
    const formatted = exp.value + "."

    if(mark) return "[H, "+mark+"] ["+formatted+"]"
    else  return formatted
}