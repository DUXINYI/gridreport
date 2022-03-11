import { IPageElement } from "../../../report/domain/description/elements/IPageElement.js";
import { IPage } from "../../../report/domain/description/IPage.js";
import { IPageElementRenderer } from "../../../report/domain/renderer/elementrenderer/IPageElementRenderer.js";
import { IBindingSource } from "../../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../report/domain/renderer/IObjectBoundingRect.js";
import { IDesignerBase } from "../IDesignerBase.js";
import { IPageDesigner } from "../IPageDesigner.js";

export interface IPageElementUi{
    designer:IPageDesigner;
    render(element:IPageElement,node:HTMLElement & IBindingSource<IPageElement> & IMeasuredBoundingRect & IObjectBoundingRect,pageNode:HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect):void;
}