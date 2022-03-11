import { IPage } from "../../report/domain/description/IPage.js";
import { ElementTypes, IPageElement } from "../../report/domain/description/elements/IPageElement";
import { IDesignerBase } from "./IDesignerBase.js";
import { IPageUi } from "./IPageUi.js";
import { IPageElementUiParser } from "./elementui/IPageElementUiParser.js";
import { IPageRenderer } from "../../report/domain/renderer/IPageRenderer.js";

export interface IPageDesigner extends IDesignerBase{
    pageUi:IPageUi;
    pageRenderer:IPageRenderer<HTMLElement>;
    designerScale:number;
    readonly document:IPage;

    selectedTarget:IPageElement;
    selectedTargets:IPageElement[];

    addPageElement(elementType:ElementTypes):IPageElement;
    removePageElements(...pageElements:IPageElement[]):void;

    select(...targets:  IPageElement[]): void ;
    unselect(...targets: IPageElement[]): void ;

    refresh():void;
    create():void;
    open(document:IPage):void;
    save():IPage;
}