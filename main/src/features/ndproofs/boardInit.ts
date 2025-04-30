import {PreviewTreeComponent} from "./types/proofBoard";
import {
    exp,
    mark,
    rule,
    tree,
    treeExp
} from "./models/components/components";
import {RULE} from "./types/proofRules";

export function boardComponents(): PreviewTreeComponent[] {
    return [
        tree(
            exp("Likes(a, b)"),
            rule(RULE.AND_ELIM_LEFT),
            [
                tree(
                    exp("∃y (Likes(x, y))"),
                    rule(),
                    [exp(), exp("a", 3)],
                    [mark(1)]
                ),
                exp(),
                exp("a")
            ],
            [],
            {x: 400, y: 200}
        ),
        tree(
            exp("Likes(a, b)"),
            rule(RULE.AND_ELIM_LEFT),
            [
                exp(),
                exp("a", 1)
            ],
            [],
            {x: 700, y: 400}
        ),
        tree(
            exp("Likes(a, b)"),
            rule(RULE.FORALL_ELIM),
            [
                exp(),
            ],
            [],
            {x: 100, y: 200}
        ),
        treeExp(exp("Likes(a, b)", 1), {x: 120, y: 400}),
        treeExp(exp(), {x: 50, y: 600}),
        treeExp(exp("b"), {x: 100, y: 500})
    ];
}

