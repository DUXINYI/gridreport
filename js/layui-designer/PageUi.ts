import { PageUi as Origin } from "../designer/concrete/PageUi.js";
import { IPageDesigner } from "../designer/domain/IPageDesigner.js";
import { PageElementUiParser } from "./PageElementUiParser.js";
export class PageUi extends Origin{
    constructor(designer:IPageDesigner){
        const elementUiParser = new PageElementUiParser();
        super(designer,elementUiParser);
    }
    afterRender(): void {
        (<any>window).afterPageRender();
    }
}