import {Component} from "./components";
import {exp, mark, rule, tree} from "./board";
import {SideBarItemList} from "./sidebar";

export const sideBarComponents: SideBarItemList[] = [
    {
        name: "Marks",
        icon: mark("M"),
        values: [
            {list: [mark("1"), mark("2"), mark("3"), mark("4"), mark("5")]}
        ]
    },
    {
        name: "Rules",
        icon: rule("R"),
        values: [
            {name: "pl", list: [rule("⊥"), rule("⊥"), rule("∧Il"), /*rule("∧Ir"), rule("∨El"), rule("∨Er"),*/
                rule("→I"), rule("→E"), rule("¬I"), rule("¬E")]},
            {name: "fol", list: [rule("∀I"), rule("∀E"), rule("∃I"), rule("∃E")]}
        ]
    },
    {
        name: "Expressions",
        icon: exp("E"),
        values: [
            {list: [exp("p ∧ q"), exp("p ∧ (p ∧ q)")]},
        ]
    }
];

export const boardComponents: Component[] = [
    tree(
        exp("Likes(a, b)"),
        rule("r1"),
        [
            tree(
                exp("∃y (Likes(x, y))"),
                rule(),
                [exp(),exp("a")],
                [mark("1")]
            ),
            exp(),
            exp("a")
        ],
        [],
        {x: 400, y: 200}
    ),
    exp("p ∧ q", {x: 100, y: 600})
];


