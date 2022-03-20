import { PageDesignRenderer as Origin } from "../designer/concrete/PageDesignRenderer.js";
import { IPageElement } from "../report/domain/description/IPageElement.js";

export class PageDesignRenderer extends Origin{
    renderPopupDom(selectedTargets: IPageElement[]): void {
        (<any>window).renderPopupDom();
    }
    renderToolbarDom(selectedTargets: IPageElement[]): void {
        (<any>window).renderToolbarDom();
    }
}