import {PreviewTreeComponent} from "./proofBoard";
import {exp, mark, rule, tree} from "../models/components/components";

export enum RULE {
    BOTTOM = "⊥",
    AND_INTRO = "∧I",
    AND_ELIM_LEFT = "∧El",
    AND_ELIM_RIGHT = "∧Er",
    OR_INTRO_LEFT = "∨Il",
    OR_ELIM = "∨E",
    OR_INTRO_RIGHT = "∨Ir",
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
    hypothesesCount: number;
    marksCount: number;
    isFOL: boolean;
    preview: PreviewTreeComponent
};

export const RULE_DETAILS: Record<RULE, RuleInfo> = {
    [RULE.BOTTOM]: {hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.BOTTOM), [exp("φ")])},
    [RULE.AND_INTRO]: {hypothesesCount: 2, marksCount: 0, isFOL: false,
        preview: tree(exp("φ ∧ ψ"), rule(RULE.AND_INTRO), [exp("φ"), exp("ψ")])},
    [RULE.AND_ELIM_LEFT]: {hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.AND_ELIM_LEFT), [exp("φ")])},
    [RULE.AND_ELIM_RIGHT]: {hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.AND_ELIM_RIGHT), [exp("φ")])},
    [RULE.OR_INTRO_LEFT]: {hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.OR_INTRO_LEFT), [exp("φ")])},
    [RULE.OR_ELIM]: {hypothesesCount: 3, marksCount: 2, isFOL: false,
        preview: tree(exp("ψ"), rule(RULE.OR_ELIM), [exp("φ1 ∨ φ2"), exp("ψ"), exp("ψ")], [mark(1), mark(2)])},
    [RULE.OR_INTRO_RIGHT]: {hypothesesCount: 1, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.OR_INTRO_RIGHT), [exp("φ")])},
    [RULE.IMPLIES_INTRO]: {hypothesesCount: 1, marksCount: 1, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.IMPLIES_INTRO), [exp("φ")])},
    [RULE.IMPLIES_ELIM]: {hypothesesCount: 2, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.IMPLIES_ELIM), [exp("φ")])},
    [RULE.NOT_INTRO]: {hypothesesCount: 1, marksCount: 1, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.NOT_INTRO), [exp("φ")])},
    [RULE.NOT_ELIM]: {hypothesesCount: 2, marksCount: 0, isFOL: false,
        preview: tree(exp("⊥"), rule(RULE.NOT_ELIM), [exp("φ")])},
    [RULE.FORALL_INTRO]: {hypothesesCount: 1, marksCount: 1, isFOL: true,
        preview: tree(exp("⊥"), rule(RULE.FORALL_INTRO), [exp("φ")])},
    [RULE.FORALL_ELIM]: {hypothesesCount: 1, marksCount: 0, isFOL: true,
        preview: tree(exp("⊥"), rule(RULE.FORALL_ELIM), [exp("φ")])},
    [RULE.EXISTS_INTRO]: {hypothesesCount: 1, marksCount: 0, isFOL: true,
        preview: tree(exp("⊥"), rule(RULE.EXISTS_INTRO), [exp("φ")])},
    [RULE.EXISTS_ELIM]: {hypothesesCount: 2, marksCount: 1, isFOL: true,
        preview: tree(exp("⊥"), rule(RULE.EXISTS_ELIM), [exp("φ")])}
};
