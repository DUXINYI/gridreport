import { IPage } from "../description/IPage.js";
import { IBindingSource } from "./IBindingSource.js";
import { IFormatResolver } from "./formatresolver/IFormatResolver.js";
import { IMeasuredBoundingRect } from "./IMeasuredBoundingRect.js";
import { IPageElementRenderer } from "./elementrenderer/IPageElementRenderer.js";
import { IPageElementRendererParser } from "./elementrenderer/IPageElementRendererParser.js"; 
import { IRendererOptions } from "./IRendererOptions.js";
import { IObjectBoundingRect } from "./IObjectBoundingRect.js";

export type IPageRendererOptions = Pick<IRendererOptions,'defaultLengthUnit'|'formatResolver'|'elementRendererParser'> & Partial<IRendererOptions>;

export interface IPageRenderer<TValue>{
    options:Partial<IPageRendererOptions> ;
    render(page:IPage):TValue & IBindingSource<IPage> & IObjectBoundingRect & IMeasuredBoundingRect;
}