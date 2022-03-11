import { LineElementUi as Origin } from "../designer/concrete/elementui/LineElementUi.js";
import { ILineElement } from "../report/domain/description/elements/ILineElement.js";
export class LineElementUi extends Origin{
    renderPopupDom(element: ILineElement): void {
        (<any>window).renderLinePopupDom(element);
    }
    renderToolbarDom(element:ILineElement) {
        (<any>window).renderLineToolbarDom(element);
    }
}