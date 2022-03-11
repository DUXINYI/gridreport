import { PageElementRendererParser } from "../../report/concrete/renderer/elementrenderer/PageElementRendererParser.js";
import { PageRenderer } from "../../report/concrete/renderer/PageRenderer.js";
import { UnitConvert } from "../../report/concrete/UnitConvert.js";
import { ILineElement } from "../../report/domain/description/elements/ILineElement.js";
import { IQrcodeElement } from "../../report/domain/description/elements/IQrcodeElement.js";
import { ITextElement } from "../../report/domain/description/elements/ITextElement.js";
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
            this.designer.designerDom.addEventListener('mousedown',(e:MouseEvent)=>this.designer.select());
            document.body.addEventListener('keydown',(e:KeyboardEvent)=>this.pageKeydown(e))
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

    pageKeydown(evt:KeyboardEvent):boolean{
        console.debug('key ',evt.key, 'down');
        //#region 方向键移动对象
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(evt.key) != -1){
                if(!this.designer.selectedTarget)
                    return false;
                //单位转换为px
                if(this.designer.selectedTarget.elementType == 'line'){
                    const selectedTarget = <ILineElement>this.designer.selectedTarget;
                    if(selectedTarget.point1.xUnit != 'px'){
                        selectedTarget.point1.x *= UnitConvert.convertToPx(selectedTarget.point1.xUnit);
                        selectedTarget.point1.xUnit = 'px';
                    }
                    if(selectedTarget.point1.yUnit != 'px'){
                        selectedTarget.point1.y *= UnitConvert.convertToPx(selectedTarget.point1.yUnit);
                        selectedTarget.point1.yUnit = 'px';
                    }
                    if(selectedTarget.point2.xUnit != 'px'){
                        selectedTarget.point2.x *= UnitConvert.convertToPx(selectedTarget.point2.xUnit);
                        selectedTarget.point2.xUnit = 'px';
                    }
                    if(selectedTarget.point2.yUnit != 'px'){
                        selectedTarget.point2.y *= UnitConvert.convertToPx(selectedTarget.point2.yUnit);
                        selectedTarget.point2.yUnit = 'px';
                    }
                }else{
                    const selectedTarget = <ITextElement | IQrcodeElement>this.designer.selectedTarget;
                    if(selectedTarget.size.wUnit != 'px'){
                        selectedTarget.size.w *= UnitConvert.convertToPx(selectedTarget.size.wUnit);
                        selectedTarget.size.wUnit = 'px';
                    }
                    if(selectedTarget.size.hUnit != 'px'){
                        selectedTarget.size.h *= UnitConvert.convertToPx(selectedTarget.size.hUnit);
                        selectedTarget.size.hUnit = 'px';
                    }
                    if(selectedTarget.position.xUnit != 'px'){
                        selectedTarget.position.x *= UnitConvert.convertToPx(selectedTarget.position.xUnit);
                        selectedTarget.position.xUnit = 'px';
                    }
                    if(selectedTarget.position.yUnit != 'px'){
                        selectedTarget.position.y *= UnitConvert.convertToPx(selectedTarget.position.yUnit);
                        selectedTarget.position.yUnit = 'px';
                    }
                }
                const documentWidth = this.designer.document.size.w * UnitConvert.convertToPx(this.designer.document.size.wUnit);
                const documentHeight = this.designer.document.size.h * UnitConvert.convertToPx(this.designer.document.size.hUnit);
                //位移
                if(this.designer.selectedTarget.elementType == 'line'){
                    const selectedTarget = <ILineElement>this.designer.selectedTarget;
                    if(evt.key == 'ArrowLeft'){
                        //左移
                        if(Math.min(selectedTarget.point1.x,selectedTarget.point2.x)>=1){
                            selectedTarget.point1.x --;
                            selectedTarget.point2.x --;
                        }
                    }else if(evt.key == 'ArrowUp'){
                        //上移
                        if(Math.min(selectedTarget.point1.y,selectedTarget.point2.y)>=1){
                            selectedTarget.point1.y --;
                            selectedTarget.point2.y --;
                        }
                    }else if(evt.key == 'ArrowRight'){
                        //右移
                        if(Math.max(selectedTarget.point1.x,selectedTarget.point2.x)<=documentWidth-1){
                            selectedTarget.point1.x ++;
                            selectedTarget.point2.x ++;
                        }
                    }else if(evt.key == 'ArrowDown'){
                        //下移
                        if(Math.max(selectedTarget.point1.y,selectedTarget.point2.y)<=documentHeight-1){
                            selectedTarget.point1.y ++;
                            selectedTarget.point2.y ++;
                        }
                    }
                }else{
                    const selectedTarget = <ITextElement | IQrcodeElement>this.designer.selectedTarget;
                    if(evt.key == 'ArrowLeft'){
                        //左移
                        selectedTarget.position.x = Math.max(0,selectedTarget.position.x-1);
                    }else if(evt.key == 'ArrowUp'){
                        //上移
                        selectedTarget.position.y = Math.max(0,selectedTarget.position.y-1);
                    }else if(evt.key == 'ArrowRight'){
                        //右移
                        selectedTarget.position.x = Math.min(documentWidth - selectedTarget.size.w,selectedTarget.position.x+1);
                    }else if(evt.key == 'ArrowDown'){
                        //下移
                        selectedTarget.position.y = Math.min(documentHeight - selectedTarget.size.h,selectedTarget.position.y+1);
                    }
                }
                    this.designer.refresh();
                    return true;
            }
        //#endregion 方向键移动对象
        //#region  删除键删除对象
        if(evt.key == 'Delete'){
            this.designer.removePageElements(this.designer.selectedTarget);
            return true;
        }
        //#endregion 删除键删除对象
        return false;
    }
}