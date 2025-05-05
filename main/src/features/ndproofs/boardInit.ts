import {PreviewExpComponent, PreviewTreeComponent} from "./types/proofBoard";
import {
    exp,
    mark,
    rule,
    tree,
    treeExp
} from "./models/components/components";
import {RULE} from "./types/proofRules";

export function boardExercise(): PreviewTreeComponent[] {
    return [treeExp(exp("(φ ∨ ψ) ∧ (φ ∨ δ)", 1)), treeExp(exp("(φ ∨ ψ)", 2)), treeExp(exp("φ ∨ (ψ ∧ δ)"))]
}

export function boardComponents(): PreviewTreeComponent[] {
    return [
        tree(
            exp("Likes(a, b)"),
            rule(RULE.AND_ELIM_LEFT),
            [
                tree(
                    exp("∃y (Likes(x, y))"),
                    rule(RULE.AND_ELIM_LEFT),
                    [exp(), exp("a", 3)],
                    [mark(1)]
                ),
                exp(),
                exp("a")
            ],
            [],
            {x: 2100, y: 1200}
        ),
        tree(
            exp("Likes(a, b)"),
            rule(RULE.AND_ELIM_LEFT),
            [
                exp(),
                exp("a", 1)
            ],
            [],
            {x: 2700, y: 1000}
        ),
        tree(
            exp("Likes(a, b)"),
            rule(RULE.FORALL_ELIM),
            [
                exp(),
            ],
            [],
            {x: 2600, y: 1200}
        ),
        treeExp(exp("Likes(a, b)", 1), {x: 545, y: 241}),
        treeExp(exp("b"), {x: 2000, y: 1500})
    ];
}

