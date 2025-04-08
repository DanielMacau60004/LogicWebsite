import {Component, createExpression, createMark, createRule, createTree} from "./components";

export const boardItems: { [key: number]: number } = {};
export const components: { [key: number]: Component } = {};

let id = 0;

//TODO change to a better format
const trees = [
    {
        conclusion: "c1",
        rule: "r1",
        hypotheses: [
            {
                conclusion: "c2",
                rule: undefined,
                hypotheses: [
                    {
                        conclusion: "c3",
                        rule: "r3",
                        hypotheses: [undefined, undefined],
                        marks: ["3_1", "3_2"]
                    },
                    undefined
                ],
                marks: ["2_1", "2_2"]
            },
            undefined,
            undefined
        ]
    }
];

function addComponent(component : Component) {
    components[component.id] = component;
    return component.id;
}

function treeBoardItemConverter(tree: any, parent?: number) {
    const treeID = id++;

    const conclusion = addComponent(createExpression(id++, treeID, tree.conclusion))
    const rule = addComponent(createRule(id++, treeID, tree.rule))

    const hypotheses = tree.hypotheses.map((hypothesis: any) => {
        if (typeof hypothesis === 'string')
            return addComponent(createExpression(id++, treeID, { value: hypothesis }));
        if (hypothesis)
            return treeBoardItemConverter(hypothesis, treeID);
        return addComponent(createExpression(id++, treeID));
    });

    const marks = tree.marks?.map((m: any) => addComponent(createMark(id++, treeID,m)));

    return addComponent(createTree(treeID, conclusion, rule, hypotheses, marks, parent))
}

trees.forEach(tree => {
    const treeID = treeBoardItemConverter(tree);
    boardItems[treeID] = treeID;
});

