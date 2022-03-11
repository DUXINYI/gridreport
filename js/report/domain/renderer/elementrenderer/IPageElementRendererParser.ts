import { IPageElement } from "../../description/elements/IPageElement";
import { IPageElementRenderer } from "./IPageElementRenderer.js";

export interface IPageElementRendererParser<TValue> {
    parse(element:IPageElement,options:any):IPageElementRenderer<TValue>;
}