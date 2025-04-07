import { Component } from "./board";

export const boardItems: { [key: number]: number } = {};
export const components: { [key: number]: Component } = {};

let id = 0;

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

function createComponent(type: string, id:number, value?: any, parent?: any) {

    const component: Component = {
        id: id,
        type,
        ...(value !== undefined && { value }),
        ...(parent !== undefined && { parent })
    };

    components[component.id] = component;
    return component.id;
}

function treeBoardItemConverter(tree: any, parent?: number) {
    const treeID = id++;

    const conclusion = createComponent("exp",id++, tree.conclusion, treeID);
    const rule = createComponent("rule", id++, tree.rule, treeID);

    const hypotheses = tree.hypotheses.map((h: any) => {
        if (h) {
            if (typeof h === 'string') return createComponent("exp", id++, h, treeID);
            else return treeBoardItemConverter(h, treeID);
        } else return createComponent("exp", id++, undefined, treeID);
    });

    const marks = tree.marks?.map((m: any) => {
        return createComponent("mark", id++, m, treeID);
    });

    components[treeID] = {id: treeID, type: "tree", conclusion: conclusion, rule: rule, hypotheses: hypotheses, marks: marks,
        parent: parent};
    return treeID
}

trees.forEach(tree => {
    const treeID = treeBoardItemConverter(tree);
    boardItems[treeID] = treeID;
});

console.log(components)

