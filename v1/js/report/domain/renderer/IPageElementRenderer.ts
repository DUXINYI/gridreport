import { IPageElement } from "../description/IPageElement.js";
import { IBindingSource } from "./IBindingSource.js";
import { IFormatResolver } from "./IFormatResolver.js";
import { IMeasuredBoundingRect } from "./IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "./IObjectBoundingRect.js";

export interface IPageElementRenderer<TValue>{
    formatResolver:IFormatResolver;
    render(pageElement:IPageElement,pageNode:TValue):TValue & IMeasuredBoundingRect & IObjectBoundingRect & IBindingSource<IPageElement> ;
}