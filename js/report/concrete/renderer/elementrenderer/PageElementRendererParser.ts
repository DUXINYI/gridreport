import { IPageElement } from "../../../domain/description/elements/IPageElement.js";
import { ILineElementRenderer } from "../../../domain/renderer/elementrenderer/ILineElementRenderer.js";
import { IPageElementRendererParser } from "../../../domain/renderer/elementrenderer/IPageElementRendererParser.js";
import { IQrcodeElementRenderer } from "../../../domain/renderer/elementrenderer/IQrcodeElementRenderer.js";
import { ITextElementRenderer } from "../../../domain/renderer/elementrenderer/ITextElementRenderer.js";
import { IRendererOptions } from "../../../domain/renderer/IRendererOptions.js";
import { LineElementRenderer } from "./LineElementRenderer.js";
import { QrcodeElementRenderer } from "./QrcodeElementRenderer.js";
import { TextElementRenderer } from "./TextElementRenderer.js";

export class PageElementRendererParser implements IPageElementRendererParser<HTMLElement>{
    parse(element:IPageElement,options:Partial<IRendererOptions>):ITextElementRenderer<HTMLElement> | IQrcodeElementRenderer<HTMLElement> | ILineElementRenderer<HTMLElement>{
        if(element?.elementType == null)
            throw '无法从elementType字段中推断出元素类型';
        switch(element.elementType){
            case 'text':
                return new TextElementRenderer(options);
            case 'qrcode':
                return new QrcodeElementRenderer(options);
            case 'line':
                return new LineElementRenderer(options);
            default:
                throw `不支持的元素类型${element.elementType}`;
        }
    }
}