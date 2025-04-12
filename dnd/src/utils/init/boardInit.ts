import {Component} from "../components";
import {exp, mark, rule, tree} from "../board";

export function boardComponents(): Component[] {
    return [
        tree(
            exp("Likes(a, b)"),
            rule("r1"),
            [
                tree(
                    exp("∃y (Likes(x, y))"),
                    rule(),
                    [exp(), exp("a")],
                    [mark("1")]
                ),
                exp(),
                exp("a")
            ],
            [],
            {x: 400, y: 200}
        ),
        tree(
            exp("∃y (Likes(x, y))"),
            rule(),
            [exp(), exp("a")],
            [mark("1")],
            {x: 300, y: 400}
        ),
        exp("p ∧ q", {x: 100, y: 600}),
        tree(
            exp("∃y (Likes(x, y))"),
            rule(),
            [exp(), exp("a")],
            [mark("1")],
            {x: 700, y: 400}
        ),

    ];
}

