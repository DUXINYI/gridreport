import { IPageElement } from "../../description/elements/IPageElement.js";
import { IBindingSource } from "../IBindingSource.js";
import { IFormatResolver } from "../formatresolver/IFormatResolver.js";
import { IMeasuredBoundingRect } from "../IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../IObjectBoundingRect.js";
import { IRendererOptions } from "../IRendererOptions.js";

export type IPageElementRendererOptions = Pick<IRendererOptions,'defaultLengthUnit'>;
export interface IPageElementRenderer<TValue>{
    options:Partial<IPageElementRendererOptions>;
    render(pageElement:IPageElement,pageNode:TValue):TValue & IMeasuredBoundingRect & IObjectBoundingRect & IBindingSource<IPageElement> ;
}