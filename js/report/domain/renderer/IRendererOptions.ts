import { IPageElementRendererParser } from "./elementrenderer/IPageElementRendererParser";
import { IFormatResolver } from "./formatresolver/IFormatResolver.js";

export interface IRendererOptions{
    defaultLengthUnit:string;
    formatResolver:IFormatResolver;
    qrcodeRequestUrl:string;
    elementRendererParser:IPageElementRendererParser<any>;
}