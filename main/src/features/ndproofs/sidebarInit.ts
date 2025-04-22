import {SideBarCreatorComponentList} from "./types/proofSidebar";
import {createPreviewTree} from "./models/proofComponents";

export function sideBarComponents(): SideBarCreatorComponentList[] {
    return [
        /*{
            name: "Tree Templates",
            icon: createPreviewTree(undefined, undefined, [undefined], []),
            values: [
                {
                    name: "temp1",
                    list: [createPreviewTree(undefined, undefined, [undefined], [])]
                },
                {
                    name: "temp2",
                    list: [createPreviewTree(undefined, undefined, [undefined], [undefined])]
                },
                {
                    name: "temp3",
                    list: [createPreviewTree(undefined, undefined, [undefined, undefined], [])]
                },
                {
                    name: "temp4",
                    list: [createPreviewTree(undefined, undefined, [undefined, undefined, undefined], [undefined, undefined])]
                }
            ]
        },
        {
            name: "Tree",
            icon: createPreviewTree(undefined, undefined, [undefined], []),
            values: [
                {
                    name: "elim dis",
                    list: [createPreviewTree(undefined, "∨E", [undefined, undefined, undefined], [1, 2])]
                },
                {
                    name: "absurdity",
                    list: [createPreviewTree(undefined, undefined, ["⊥"], [1])]
                },
                {
                    name: "elim neg",
                    list: [createPreviewTree("⊥", "¬E", [undefined, undefined], [])]
                }
            ]
        }*/
    ];
}