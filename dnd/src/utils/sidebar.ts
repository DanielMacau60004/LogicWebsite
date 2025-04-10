import {Component} from "./components";

export interface SideBarComponent {
    name?: string,
    list: Component[]
}

export interface SideBarItemList {
    name: string;
    icon: Component;
    values: SideBarComponent[];
}