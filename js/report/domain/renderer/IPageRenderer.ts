import { IPage } from "../description/IPage.js";
import { IBindingSource } from "./IBindingSource.js";
import { IFormatResolver } from "./IFormatResolver.js";
import { IMeasuredBoundingRect } from "./IMeasuredBoundingRect.js";
import { IPageElementRenderer } from "./IPageElementRenderer.js";
 
export interface IPageRenderer<TValue>{
    formatResolver:IFormatResolver;
    elementRenderer:IPageElementRenderer<TValue>;
    render(page:IPage):TValue & IBindingSource<IPage> & IMeasuredBoundingRect;
}