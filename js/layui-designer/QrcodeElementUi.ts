import { QrcodeElementUi as Origin } from "../designer/concrete/elementui/QrcodeElementUi.js";
import { IQrcodeElement } from "../report/domain/description/elements/IQrcodeElement.js";
export class QrcodeElementUi extends Origin{
    renderPopupDom(element: IQrcodeElement): void {
        (<any>window).renderQrcodePopupDom(element);
    }
    renderToolbarDom(element:IQrcodeElement) {
        (<any>window).renderQrcodeToolbarDom(element);
    }
}