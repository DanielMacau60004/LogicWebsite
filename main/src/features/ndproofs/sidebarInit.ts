import {SideBarCreatorComponentList} from "./types/proofSidebar";
import {exp, mark, rule, tree} from "./models/proofBoardComponentsFactory";

export function sideBarComponents(): SideBarCreatorComponentList[] {
    return [
        {
            name: "Marks",
            icon: mark("M"),
            values: [
                {
                    list: [mark("1"), mark("2"), mark("3"), mark("4"), mark("5")]
                }
            ]
        },
        {
            name: "Rules",
            icon: rule("R"),
            values: [
                {
                    name: "pl",
                    list: [rule("⊥"), rule("∧I"), rule("∧El"), rule("∧Er"), rule("∨Il"), rule("∨E"), rule("∨Ir"),
                        rule("→I"), rule("→E"), rule("¬I"), rule("¬E")]
                },
                {
                    name: "fol",
                    list: [rule("∀I"), rule("∀E"), rule("∃I"), rule("∃E")]
                }
            ]
        },
        {
            name: "Expressions",
            icon: exp("E"),
            values: [
                {
                    list: [exp("p ∧ q"), exp("p ∧ (p ∧ q)")]
                },
            ]
        },
        {
            name: "Tree Templates",
            icon: exp("T"),
            values: [
                {
                    name: "temp1",
                    list: [tree(exp(), rule(), [exp()], [])]
                },
                {
                    name: "temp2",
                    list: [tree(exp(), rule(), [exp()], [mark()])]
                },
                {
                    name: "temp3",
                    list: [tree(exp(), rule(), [exp(), exp()], [])]
                },
                {
                    name: "temp4",
                    list: [tree(exp(), rule(), [exp(), exp(), exp()], [mark(), mark()])]
                }
            ]
        },
        {
            name: "Tree",
            icon: exp("T"),
            values: [
                {
                    name: "elim dis",
                    list: [tree(exp(), rule("∨E"), [exp(), exp(), exp()], [mark("m"), mark("n")])]
                },
                {
                    name: "absurdity",
                    list: [tree(exp(), rule(), [exp("⊥")], [mark("m")])]
                },
                {
                    name: "elim neg",
                    list: [tree(exp("⊥"), rule("¬E"), [exp(), exp()], [])]
                }
            ]
        }
    ];
}