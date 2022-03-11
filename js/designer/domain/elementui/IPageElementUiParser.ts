import { ILineElement } from "../../../report/domain/description/elements/ILineElement";
import { IPageElement } from "../../../report/domain/description/elements/IPageElement.js";
import { IQrcodeElement } from "../../../report/domain/description/elements/IQrcodeElement";
import { ITextElement } from "../../../report/domain/description/elements/ITextElement";
import { ILineElementUi } from "./ILineElementUi";
import { IPageElementUi } from "./IPageElementUi";
import { IQrcodeElementUi } from "./IQrcodeElementUi";
import { ITextElementUi } from "./ITextElementUi";

export interface IPageElementUiParser{
    //本类需要保证同一个Parser实例对同样的elementType返回同一个ElementUi，否则Ui内部无法维护其状态
    parse(elementType:'text'):ITextElementUi;
    parse(elementType:'qrcode'):IQrcodeElementUi;
    parse(elementType:'line'):ILineElementUi;
}