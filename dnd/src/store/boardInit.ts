import {
    Component,
    createConclusion,
    createExpression,
    createMark,
    createRule,
    createTree,
    EComponentTypes
} from "./components";

export const boardItems: { [key: number]: number } = {};
export const components: { [key: number]: Component } = {};

let id = 0;

//TODO change to a better format
const trees = [
    {
        conclusion: "Likes(a, b)",
        rule: "r1",
        hypotheses: [
            {
                conclusion: "∃y (Likes(x, y))",
                rule: undefined,
                hypotheses: [
                    undefined
                ],
                marks: ["3"]
            },
            undefined
        ]
    },
    {
        conclusion: "Happy(a) ∨ Sad(a)",
        rule: undefined,
        hypotheses: [
            {
                conclusion: "∀x (Student(x) → (Happy(x) ∨ Sad(x)))",
                rule: undefined,
                hypotheses: [undefined, undefined],
                marks: []
            },
            "¬Likes(x, Pizza)",
            undefined
        ],
        marks: ["3"]
    },
    {
        conclusion: "Sad(a)",
        rule: undefined,
        hypotheses: [
            {
                conclusion: "Happy(a)",
                rule: undefined,
                hypotheses: [undefined, undefined],
                marks: []
            },
            {
                conclusion: "∃x ¬Likes(x, Pizza)",
                rule: undefined,
                hypotheses: [undefined, undefined],
                marks: ["1"]
            }
        ],
        marks: ["3"]
    },
    {
        conclusion: "Sad(a)",
        rule: undefined,
        hypotheses: [
            {
                conclusion: "Happy(a)",
                rule: undefined,
                hypotheses: [undefined, undefined],
                marks: []
            },
            {
                conclusion: "∃x ¬Likes(x, Pizza)",
                rule: undefined,
                hypotheses: [undefined, undefined],
                marks: ["1"]
            }
        ],
        marks: ["3"]
    }
];

function addComponent(component : Component) {
    components[component.id] = component;
    return component.id;
}

function treeBoardItemConverter(tree: any, parent?: number) {
    const treeID = id++;

    const conclusion = addComponent(createConclusion(id++, treeID, tree.conclusion))
    const rule = addComponent(createRule(id++, treeID, tree.rule))

    const hypotheses = tree.hypotheses.map((hypothesis: any) => {
        if (typeof hypothesis === 'string')
            return addComponent(createExpression(id++, treeID, hypothesis));
        if (hypothesis)
            return treeBoardItemConverter(hypothesis, treeID);
        return addComponent(createExpression(id++, treeID));
    });

    const marks = tree.marks?.map((m: any) => addComponent(createMark(id++, treeID, m)));

    return addComponent(createTree(treeID, conclusion, rule, hypotheses, marks, parent))
}

trees.forEach(tree => {
    const treeID = treeBoardItemConverter(tree);
    boardItems[treeID] = treeID;
});

