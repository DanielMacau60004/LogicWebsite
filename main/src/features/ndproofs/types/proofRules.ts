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
};

export const RULE_DETAILS: Record<RULE, RuleInfo> = {
    [RULE.BOTTOM]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.AND_INTRO]: { hypothesesCount: 2, marksCount: 0 },
    [RULE.AND_ELIM_LEFT]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.AND_ELIM_RIGHT]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.OR_INTRO_LEFT]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.OR_ELIM]: { hypothesesCount: 3, marksCount: 2 },
    [RULE.OR_INTRO_RIGHT]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.IMPLIES_INTRO]: { hypothesesCount: 1, marksCount: 1 },
    [RULE.IMPLIES_ELIM]: { hypothesesCount: 2, marksCount: 0 },
    [RULE.NOT_INTRO]: { hypothesesCount: 1, marksCount: 1 },
    [RULE.NOT_ELIM]: { hypothesesCount: 2, marksCount: 0 },
    [RULE.FORALL_INTRO]: { hypothesesCount: 1, marksCount: 1 },
    [RULE.FORALL_ELIM]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.EXISTS_INTRO]: { hypothesesCount: 1, marksCount: 0 },
    [RULE.EXISTS_ELIM]: { hypothesesCount: 2, marksCount: 1 }
};
