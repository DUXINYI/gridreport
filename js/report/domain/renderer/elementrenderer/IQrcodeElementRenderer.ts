import { IQrcodeElement } from "../../description/elements/IQrcodeElement";
import { ITextElement } from "../../description/elements/ITextElement";
import { IFormatResolver } from "../formatresolver/IFormatResolver";
import { IBindingSource } from "../IBindingSource";
import { IMeasuredBoundingRect } from "../IMeasuredBoundingRect";
import { IObjectBoundingRect } from "../IObjectBoundingRect";
import { IRendererOptions } from "../IRendererOptions";
import { IPageElementRenderer } from "./IPageElementRenderer.js";

export type IQrcodeElementRendererOptions = Pick<IRendererOptions,'formatResolver' | 'defaultLengthUnit' | 'qrcodeRequestUrl'>;

export interface IQrcodeElementRenderer<TValue> extends IPageElementRenderer<TValue>{
    options:Partial<IQrcodeElementRendererOptions>;
    render(pageElement:IQrcodeElement,pageNode:TValue):TValue & IMeasuredBoundingRect & IBindingSource<IQrcodeElement> & IObjectBoundingRect;
}