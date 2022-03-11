import { PageElementRendererParser } from "../../report/concrete/renderer/elementrenderer/PageElementRendererParser.js";
import { PageRenderer } from "../../report/concrete/renderer/PageRenderer.js";
import { IPage } from "../../report/domain/description/IPage.js";
import { IBindingSource } from "../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../report/domain/renderer/IObjectBoundingRect.js";
import { IPageRenderer } from "../../report/domain/renderer/IPageRenderer.js";
import { IPageElementUiParser } from "../domain/elementui/IPageElementUiParser.js";
import { IPageDesigner } from "../domain/IPageDesigner.js";
import { IPageUi } from "../domain/IPageUi.js";

export class PageUi implements IPageUi{
    elementUiParser: IPageElementUiParser;
    designer: IPageDesigner;
    constructor(designer:IPageDesigner,elementUiParser:IPageElementUiParser){
        this.designer = designer;
        this.elementUiParser = elementUiParser;
    }

    private lasttickDesignerDom:HTMLElement;
    render(page: IPage,node:HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect): void {
        //点击空白区域取消选中
        if(this.lasttickDesignerDom != this.designer.designerDom){
            this.lasttickDesignerDom = this.designer.designerDom;
            this.designer.designerDom.addEventListener('mousedown',(e:MouseEvent)=>this.designer.select())
        }

        for(let pageElement of this.designer.document.elements){
            let elementUi = this.elementUiParser.parse(<any>pageElement.elementType);
            elementUi.designer = this.designer;
            let elementNode;
            node
                .querySelectorAll('.element-box')
                .forEach(elem=>{
                    if((<any>elem).sourceObject == pageElement)
                        elementNode = elem;
                });
            elementUi.render(<any>pageElement,elementNode,node);
        }
    }
    beforeRender():void{

    }
    afterRender(): void {
        if(this.designer.selectedTarget == null){
            this.designer.toolbarDom.innerHTML = '未选中'
        }
    }
}