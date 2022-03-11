import { IPage } from "../../report/domain/description/IPage.js";
import { IPageElement } from "../../report/domain/description/elements/IPageElement.js";
import { IPageDesigner } from "./IPageDesigner.js";
import { IDesignerBase } from "./IDesignerBase.js";
import { IPageRenderer } from "../../report/domain/renderer/IPageRenderer.js";
import { IPageElementUiParser } from "./elementui/IPageElementUiParser.js";
import { IBindingSource } from "../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../report/domain/renderer/IObjectBoundingRect.js";

export interface IPageUi{
    elementUiParser:IPageElementUiParser;
    designer:IPageDesigner;
    render(page:IPage,node:HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect):void;
    beforeRender():void;
    afterRender():void;
}