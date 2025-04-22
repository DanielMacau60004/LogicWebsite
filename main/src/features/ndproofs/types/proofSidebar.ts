import {TreeComponent, TreePreviewComponent} from "./proofBoard";

export interface SideBarCreatorComponent {
    name?: string,
    list: TreePreviewComponent[]
}

export interface SideBarCreatorComponentList {
    name: string;
    icon: TreePreviewComponent;//JSX.Element;
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
