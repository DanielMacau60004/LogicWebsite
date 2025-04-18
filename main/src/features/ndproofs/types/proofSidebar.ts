import {BoardComponent, BoardPreviewComponent} from "./proofBoard";

export interface SideBarCreatorComponent {
    name?: string,
    list: BoardPreviewComponent[]
}

export interface SideBarCreatorComponentList {
    name: string;
    icon: BoardPreviewComponent;//JSX.Element;
    values: SideBarCreatorComponent[];
}

export interface SideBarComponent {
    name?: string,
    list: BoardComponent[]
}

export interface SideBarComponentList {
    name: string;
    icon: BoardComponent;//JSX.Element;
    values: SideBarComponent[];
}
