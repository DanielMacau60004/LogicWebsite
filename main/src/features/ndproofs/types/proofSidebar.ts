import {TreeComponent, PreviewTreeComponent} from "./proofBoard";

export interface SideBarCreatorComponent {
    name?: string,
    list: PreviewTreeComponent[]
}

export interface SideBarCreatorComponentList {
    name: string;
    icon: PreviewTreeComponent;//JSX.Element;
    values: SideBarCreatorComponent[];
}

export interface SideBarComponent {
    name?: string,
    list: TreeComponent[]
}

export interface SideBarComponentList {
    name: string;
    icon: TreeComponent;//JSX.Element;
    values: SideBarComponent[];
}
