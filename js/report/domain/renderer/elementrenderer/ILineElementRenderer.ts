import { ILineElement } from "../../description/elements/ILineElement";
import { ITextElement } from "../../description/elements/ITextElement";
import { IBindingSource } from "../IBindingSource";
import { IMeasuredBoundingRect } from "../IMeasuredBoundingRect";
import { IObjectBoundingRect } from "../IObjectBoundingRect";
import { IRendererOptions } from "../IRendererOptions";
import { IPageElementRenderer, IPageElementRendererOptions } from "./IPageElementRenderer.js";

export type ILineElementRendererOptions = IPageElementRendererOptions;

export interface ILineElementRenderer<TValue> extends IPageElementRenderer<TValue>{
    render(pageElement:ILineElement,pageNode:TValue):TValue & IMeasuredBoundingRect & IBindingSource<ILineElement> & IObjectBoundingRect;
}