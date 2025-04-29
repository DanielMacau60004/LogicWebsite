import {PreviewTreeComponent} from "./types/proofBoard";
import {
    createPreviewExp,
    createPreviewMark,
    createPreviewRule,
    createPreviewTree,
    createPreviewTreeExp
} from "./models/proofComponents";
import {RULE} from "./types/proofRules";

export function boardComponents(): PreviewTreeComponent[] {
    return [
        createPreviewTree(
            createPreviewExp("Likes(a, b)"),
            createPreviewRule(RULE.AND_ELIM_LEFT),
            [
                createPreviewTree(
                    createPreviewExp("∃y (Likes(x, y))"),
                    createPreviewRule(),
                    [createPreviewExp(), createPreviewExp("a", 3)],
                    [createPreviewMark(1)]
                ),
                createPreviewExp(),
                createPreviewExp("a")
            ],
            [],
            {x: 400, y: 200}
        ),
        createPreviewTree(
            createPreviewExp("Likes(a, b)"),
            createPreviewRule(RULE.AND_ELIM_LEFT),
            [
                createPreviewExp(),
                createPreviewExp("a", 1)
            ],
            [],
            {x: 700, y: 400}
        ),
        createPreviewTree(
            createPreviewExp("Likes(a, b)"),
            createPreviewRule(RULE.FORALL_ELIM),
            [
                createPreviewExp(),
            ],
            [],
            {x: 100, y: 200}
        ),
        createPreviewTreeExp(createPreviewExp("Likes(a, b)", 1), {x: 120, y: 400}),
        createPreviewTreeExp(createPreviewExp(), {x: 50, y: 600}),
        createPreviewTreeExp(createPreviewExp("b"), {x: 100, y: 500})
    ];
}

