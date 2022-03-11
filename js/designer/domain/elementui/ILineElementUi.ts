import { ILineElement } from "../../../report/domain/description/elements/ILineElement.js";
import { ITextElement } from "../../../report/domain/description/elements/ITextElement.js";
import { IPage } from "../../../report/domain/description/IPage.js";
import { ILineElementRenderer } from "../../../report/domain/renderer/elementrenderer/ILineElementRenderer.js";
import { ITextElementRenderer } from "../../../report/domain/renderer/elementrenderer/ITextElementRenderer.js";
import { IBindingSource } from "../../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../report/domain/renderer/IObjectBoundingRect.js";
import { IPageElementUi } from "./IPageElementUi.js";

export interface ILineElementUi extends IPageElementUi{
    render(element:ILineElement,node:HTMLElement & IBindingSource<ILineElement> & IMeasuredBoundingRect & IObjectBoundingRect,pageNode:HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect):void;
}