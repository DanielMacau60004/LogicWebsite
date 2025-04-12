import {SideBarItemList} from "../sidebar";
import {expC, markC, ruleC, treeC} from "../board";

export const sideBarComponents: SideBarItemList[] = [
    {
        name: "Marks",
        icon: markC("M"),
        values: [
            {
                list: [markC("1"), markC("2"), markC("3"), markC("4"), markC("5")]
            }
        ]
    },
    {
        name: "Rules",
        icon: ruleC("R"),
        values: [
            {
                name: "pl",
                list: [ruleC("⊥"), ruleC("∧I"), ruleC("∧El"), ruleC("∧Er"), ruleC("∨Il"), ruleC("∨E"), ruleC("∨Ir"),
                    ruleC("→I"), ruleC("→E"), ruleC("¬I"), ruleC("¬E")]
            },
            {
                name: "fol",
                list: [ruleC("∀I"), ruleC("∀E"), ruleC("∃I"), ruleC("∃E")]
            }
        ]
    },
    {
        name: "Expressions",
        icon: expC("E"),
        values: [
            {
                list: [expC("p ∧ q"), expC("p ∧ (p ∧ q)")]
            },
        ]
    },
    {
        name: "Tree Templates",
        icon: expC("T"),
        values: [
            {
                name: "temp1",
                list: [treeC(expC(), ruleC(), [expC()], [])]
            },
            {
                name: "temp2",
                list: [treeC(expC(), ruleC(), [expC()], [markC()])]},
            {
                name: "temp3",
                list: [treeC(expC(), ruleC(), [expC(), expC()], [])]
            },
            {
                name: "temp4",
                list: [treeC(expC(), ruleC(), [expC(), expC()], [markC()])]
            },
            {
                name: "temp5",
                list: [treeC(expC(), ruleC(), [expC(), expC(), expC()], [markC(), markC()])]
            }
        ]
    },
    {
        name: "Tree",
        icon: expC("T"),
        values: [
            {
                name: "elim dis",
                list: [treeC(expC(), ruleC("∨E"), [expC(), expC(), expC()], [markC("m"), markC("n")])]
            },
            {
                name: "absurdity",
                list: [treeC(expC(), ruleC(), [expC("⊥")], [markC("m")])]
            },
            {
                name: "elim neg",
                list: [treeC(expC("⊥"), ruleC("¬E"), [expC(), expC()], [])]
            }
        ]
    }
];