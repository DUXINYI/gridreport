import { ITextElement } from "../../description/elements/ITextElement";
import { IFormatResolver } from "../formatresolver/IFormatResolver";
import { IBindingSource } from "../IBindingSource";
import { IMeasuredBoundingRect } from "../IMeasuredBoundingRect";
import { IObjectBoundingRect } from "../IObjectBoundingRect";
import { IRendererOptions } from "../IRendererOptions";
import { IPageElementRenderer } from "./IPageElementRenderer.js";

export type ITextElementRendererOptions = Pick<IRendererOptions,'formatResolver' | 'defaultLengthUnit'>;

export interface ITextElementRenderer<TValue> extends IPageElementRenderer<TValue>{
    options:Partial<ITextElementRendererOptions>;
    render(pageElement:ITextElement,pageNode:TValue):TValue & IMeasuredBoundingRect & IObjectBoundingRect & IBindingSource<ITextElement> ;
}