import { TextElementUi as Origin } from "../designer/concrete/elementui/TextElementUi.js";
import { ITextElement } from "../report/domain/description/elements/ITextElement";
export class TextElementUi extends Origin{
    renderPopupDom(element: ITextElement): void {
        (<any>window).renderTextPopupDom(element);
    }
    renderToolbarDom(element:ITextElement) {
        (<any>window).renderTextToolbarDom(element);
    }
}