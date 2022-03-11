import { IQrcodeElement } from "../../../report/domain/description/elements/IQrcodeElement.js";
import { ITextElement } from "../../../report/domain/description/elements/ITextElement.js";
import { IPage } from "../../../report/domain/description/IPage.js";
import { IQrcodeElementRenderer } from "../../../report/domain/renderer/elementrenderer/IQrcodeElementRenderer.js";
import { ITextElementRenderer } from "../../../report/domain/renderer/elementrenderer/ITextElementRenderer.js";
import { IBindingSource } from "../../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../report/domain/renderer/IObjectBoundingRect.js";
import { IPageElementUi } from "./IPageElementUi.js";

export interface IQrcodeElementUi extends IPageElementUi{
    render(element:IQrcodeElement,node:HTMLElement & IBindingSource<IQrcodeElement> & IMeasuredBoundingRect & IObjectBoundingRect,pageNode:HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect):void;
}