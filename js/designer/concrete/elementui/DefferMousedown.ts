import { IPageElement } from "../../../report/domain/description/elements/IPageElement.js";

export type MousedownItem = { element: IPageElement, positionX: number, positionY: number };

export class DefferMousedown {
    static get item():MousedownItem{
        return (<any>DefferMousedown)._item;
    }
    static set item(value:MousedownItem){
        (<any>DefferMousedown)._item = value;
    }
}