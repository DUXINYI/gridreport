import { ILineElementUi } from "../../domain/elementui/ILineElementUi.js";
import { IPageElementUi } from "../../domain/elementui/IPageElementUi.js";
import { IPageElementUiParser } from "../../domain/elementui/IPageElementUiParser.js";
import { IQrcodeElementUi } from "../../domain/elementui/IQrcodeElementUi.js";
import { ITextElementUi } from "../../domain/elementui/ITextElementUi.js";
import { LineElementUi } from "./LineElementUi.js";
import { QrcodeElementUi } from "./QrcodeElementUi.js";
import { TextElementUi } from "./TextElementUi.js";

export class PageElementUiParser implements IPageElementUiParser{
    uiCache:Map<string,IPageElementUi> = new Map();
    parse(elementType: "text"): ITextElementUi;
    parse(elementType: "qrcode"): IQrcodeElementUi;
    parse(elementType: "line"): ILineElementUi;
    parse(elementType: any): ITextElementUi | IQrcodeElementUi | ILineElementUi {
        const fetchUi = (elemType:string) =>this.uiCache.has(elemType) ? this.uiCache.get(elemType) : null;
        let ret = fetchUi(elementType);
        if(ret)
            return ret;

        switch(elementType){
            case 'text':
                this.uiCache.set(elementType, new TextElementUi());
                break;
            case 'qrcode':
                this.uiCache.set(elementType,new QrcodeElementUi());
                break;
            case 'line':
                this.uiCache.set(elementType,new LineElementUi());
                break;
            default:
                throw '无法根据elementType找到合适的设计器Ui';
        }
        return fetchUi(elementType);
    }
}