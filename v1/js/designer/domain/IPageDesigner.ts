import { IPage } from "../../report/domain/description/IPage.js";
import { IPageElement } from "../../report/domain/description/IPageElement";

export interface IPageDesigner{
    designerDom:HTMLElement;
    toolbarDom:HTMLElement;
    popupDom:HTMLElement;
    readonly document:IPage;

    selectedTarget:IPageElement;
    selectedTargets:IPageElement[];

    addPageElement(pageElement?:IPageElement):IPageElement;
    removePageElements(...pageElements:IPageElement[]):void;

    select(...targets:  IPageElement[]): void ;
    unselect(...targets: IPageElement[]): void ;

    refresh():void;
    create():void;
    open(document:IPage):void;
    save():IPage;
}