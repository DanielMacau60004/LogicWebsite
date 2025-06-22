import {PreviewTreeComponent} from "./proofBoard";
import {exp, mark, rule, tree} from "../models/components/components";
import {subStr, supStr, supSubStr} from "../../../utils/html";
import {SUB_TREE_SYMBOL} from "../constants";

export enum RULE {
    BOTTOM = "⊥",
    AND_INTRO = "∧I",
    AND_ELIM_LEFT = "∧El",
    AND_ELIM_RIGHT = "∧Er",
    OR_INTRO_LEFT = "∨Il",
    OR_INTRO_RIGHT = "∨Ir",
    OR_ELIM = "∨E",
    IMPLIES_INTRO = "→I",
    IMPLIES_ELIM = "→E",
    NOT_INTRO = "¬I",
    NOT_ELIM = "¬E",
    FORALL_INTRO = "∀I",
    FORALL_ELIM = "∀E",
    EXISTS_INTRO = "∃I",
    EXISTS_ELIM = "∃E"
}

export type RuleInfo = {
    type: string,
    hypothesesCount: number;
    marksCount: number;
    isFOL: boolean;
    preview: PreviewTreeComponent
};

export const RULE_DETAILS: Record<RULE, RuleInfo> = {
    [RULE.BOTTOM]: {
        type: RULE.BOTTOM,
        hypothesesCount: 1, marksCount: 1, isFOL: false,
        preview: tree(exp("φ"), rule(RULE.BOTTOM),
            [exp("⊥", {subTree: SUB_TREE_SYMBOL, markFormula: supStr("[¬φ]","m")})], [mark("m")])
    },
    [RULE.AND_INTRO]: {
        type: "∧",
        hypothesesCount: 2, marksCount: 0, isFOL: false,
        preview: tree(exp("φ ∧ ψ"), rule(RULE.AND_INTRO),
            [exp("φ", {subTree: subStr(SUB_TREE_SYMBOL, "1")}), exp("ψ", {subTree: subStr(SUB_TREE_SYMBOL, "2")})])
    },
    [RULE.AND_ELIM_LEFT]: {
        type: "∧",
        hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("ψ"), rule(RULE.AND_ELIM_LEFT), [exp("φ ∧ ψ", {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.AND_ELIM_RIGHT]: {
        type: "∧",
        hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("φ"), rule(RULE.AND_ELIM_RIGHT), [exp("φ ∧ ψ", {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.OR_INTRO_LEFT]: {
        type: "∨",
        hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("φ ∨ ψ"), rule(RULE.OR_INTRO_LEFT), [exp("ψ", {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.OR_INTRO_RIGHT]: {
        type: "∨",
        hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("φ ∨ ψ"), rule(RULE.OR_INTRO_RIGHT), [exp("φ", {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.OR_ELIM]: {
        type: "∨",
        hypothesesCount: 3, marksCount: 2, isFOL: false,
        preview: tree(exp("ψ"), rule(RULE.OR_ELIM),
            [exp(subStr("φ", "1") + " ∨ " + subStr("φ", "2"), {subTree: subStr(SUB_TREE_SYMBOL, "1")} ),
                exp("ψ", {subTree: subStr(SUB_TREE_SYMBOL, "2"), markFormula: supStr("["+subStr("φ", "1")+"]","m")}),
                exp("ψ", {subTree: subStr(SUB_TREE_SYMBOL, "3"), markFormula: supStr("["+subStr("φ", "2")+"]","n")})],
            [mark("m"), mark("n")])
    },
    [RULE.IMPLIES_INTRO]: {
        type: "→",
        hypothesesCount: 1, marksCount: 1, isFOL: false,
        preview: tree(exp("φ → ψ"), rule(RULE.IMPLIES_INTRO),
            [exp("ψ", {subTree: SUB_TREE_SYMBOL, markFormula: supStr("[φ]","m")})], [mark("m")])
    },
    [RULE.IMPLIES_ELIM]: {
        type: "→",
        hypothesesCount: 2, marksCount: 0, isFOL: false,
        preview: tree(exp("ψ"), rule(RULE.IMPLIES_ELIM),
            [exp("φ", {subTree: subStr(SUB_TREE_SYMBOL, "1")}), exp("φ → ψ", {subTree: subStr(SUB_TREE_SYMBOL, "2")})])
    },
    [RULE.NOT_INTRO]: {
        type: "¬",
        hypothesesCount: 1, marksCount: 1, isFOL: false,
        preview: tree(exp("¬φ"), rule(RULE.NOT_INTRO),
            [exp("⊥", {subTree: SUB_TREE_SYMBOL, markFormula: supStr("[φ]","m")})], [mark("m")])
    },
    [RULE.NOT_ELIM]: {
        type: "¬",
        hypothesesCount: 2, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.NOT_ELIM),
            [exp("φ", {subTree: subStr(SUB_TREE_SYMBOL, "1")}),
                exp("¬φ", {subTree: subStr(SUB_TREE_SYMBOL, "2")})])
    },
    [RULE.FORALL_INTRO]: {
        type: "∀",
        hypothesesCount: 1, marksCount: 0, isFOL: true, preview: tree(exp("∀x φ"), rule(RULE.FORALL_INTRO),
            [exp(supSubStr("[φ]", "x", "y"), {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.FORALL_ELIM]: {
        type: "∀",
        hypothesesCount: 1, marksCount: 0, isFOL: true,
        preview: tree(exp(supSubStr("[φ]", "x", "t")),
            rule(RULE.FORALL_ELIM), [exp("∀x φ", {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.EXISTS_INTRO]: {
        type: "∃",
        hypothesesCount: 1, marksCount: 0, isFOL: true,
        preview: tree(exp("∃x φ"), rule(RULE.EXISTS_INTRO),
            [exp(supSubStr("[φ]", "x", "t"), {subTree: SUB_TREE_SYMBOL})])
    },
    [RULE.EXISTS_ELIM]: {
        type: "∃",
        hypothesesCount: 2, marksCount: 1, isFOL: true,
        preview: tree(exp("ψ"), rule(RULE.FORALL_ELIM),
            [exp("∃x φ", {subTree: subStr(SUB_TREE_SYMBOL, "1")}),
                exp("ψ", {subTree: subStr(SUB_TREE_SYMBOL, "2"),
                    markFormula: supStr("("+supSubStr("[φ]", "x","y")+")","m")})], [mark("m")])
    },
};
