import {TreePreviewComponent} from "./types/proofBoard";
import {
    createPreviewExp,
    createPreviewMark,
    createPreviewRule,
    createPreviewTree
} from "./models/proofComponents";
import {RULE} from "./types/proofRules";

export function boardComponents(): TreePreviewComponent[] {
    return [
        createPreviewTree(
            createPreviewExp("Likes(a, b)"),
            createPreviewRule(RULE.AND_ELIM_LEFT),
            [
                createPreviewTree(
                    createPreviewExp("∃y (Likes(x, y))"),
                    createPreviewRule(),
                    [createPreviewExp(), createPreviewExp("a")],
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
                createPreviewExp("a")
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
    ];
}

