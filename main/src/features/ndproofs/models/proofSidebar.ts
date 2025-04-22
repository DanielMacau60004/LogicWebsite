import {appendComponent} from "./proofBoard";
import {Board, TreeComponent} from "../types/proofBoard";
import {
    SideBarComponent,
    SideBarComponentList,
    SideBarCreatorComponent,
    SideBarCreatorComponentList
} from "../types/proofSidebar";

export function appendSidebarItemList(board: Board, item: SideBarCreatorComponentList): SideBarComponentList {
    const icon = board.components[appendComponent(board, item.icon)]
    const values = item.values.map(i => appendSidebar(board, i))
    return {name: item.name, icon: icon as TreeComponent, values: values}
}

function appendSidebar(board: Board, item: SideBarCreatorComponent): SideBarComponent {
    const list = item.list.map(i => { return board.components[appendComponent(board, i, undefined)]})
    return {name: item.name, list: list as TreeComponent[]}
}