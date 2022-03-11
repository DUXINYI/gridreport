import { ITextElement } from "../../../report/domain/description/elements/ITextElement.js";
import { IPage } from "../../../report/domain/description/IPage.js";
import { ITextElementRenderer } from "../../../report/domain/renderer/elementrenderer/ITextElementRenderer.js";
import { IBindingSource } from "../../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../report/domain/renderer/IObjectBoundingRect.js";
import { IPageElementUi } from "./IPageElementUi.js";

export interface ITextElementUi extends IPageElementUi{
    render(element:ITextElement,node:HTMLElement & IBindingSource<ITextElement> & IMeasuredBoundingRect & IObjectBoundingRect,pageNode:HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect):void;
}