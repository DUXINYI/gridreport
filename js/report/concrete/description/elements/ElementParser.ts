import { ILineElement } from "../../../domain/description/elements/ILineElement.js";
import { IPageElement } from "../../../domain/description/elements/IPageElement.js";
import { IQrcodeElement } from "../../../domain/description/elements/IQrcodeElement";
import { ITextElement } from "../../../domain/description/elements/ITextElement";
import { LineElement } from "./LineElement.js";
import { QrcodeElement } from "./QrcodeElement.js";
import { TextElement } from "./TextElement.js";

export class ElementParser{
    parse(initialValue:Partial<IPageElement> | Partial<ITextElement> | Partial<IQrcodeElement> | Partial<ILineElement>) : ITextElement | IQrcodeElement | ILineElement{
        if(initialValue?.elementType == null)
            throw '无法从elementType字段中推断出元素类型';
        if(initialValue instanceof TextElement || initialValue instanceof QrcodeElement || initialValue instanceof LineElement){
            return initialValue;
        }
        switch(initialValue.elementType){
            case 'text':
                return new TextElement(<any>initialValue);
            case 'qrcode':
                return new QrcodeElement(<any>initialValue);
            case 'line':
                return new LineElement(<any>initialValue);
            default:
                throw `不支持的元素类型${(<any>initialValue).elementType}，目前支持text,qrcode,line`;
        }
    }
}