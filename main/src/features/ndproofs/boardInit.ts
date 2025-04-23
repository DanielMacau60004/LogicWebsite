import {TreePreviewComponent} from "./types/proofBoard";
import {
    createPreviewExp,
    createPreviewMark,
    createPreviewRule,
    createPreviewTree
} from "./models/proofComponents";

export function boardComponents(): TreePreviewComponent[] {
    return [
        createPreviewTree(
            createPreviewExp("Likes(a, b)"),
            createPreviewRule("r1"),
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
            createPreviewRule("r2"),
            [
                createPreviewExp(),
                createPreviewExp("a")
            ],
            [],
            {x: 700, y: 400}
        ),
        createPreviewTree(
            createPreviewExp("Likes(a, b)"),
            createPreviewRule(""),
            [
                createPreviewExp(),
            ],
            [],
            {x: 400, y: 200}
        ),
    ];
}

