import { DefaultValueCalculator } from "../../report/concrete/defaultvalue/DefaultValueCalculator.js";
import { Border } from "../../report/concrete/description/Border.js";
import { Padding } from "../../report/concrete/description/Padding.js";
import { Page } from "../../report/concrete/description/Page.js";
import { PageElement } from "../../report/concrete/description/PageElement.js";
import { Position } from "../../report/concrete/description/Position.js";
import { Size } from "../../report/concrete/description/Size.js";
import { TextSetting } from "../../report/concrete/description/TextSetting.js";
import { PageRenderer } from "../../report/concrete/renderer/PageRenderer.js";
import { IPage } from "../../report/domain/description/IPage.js";
import { IPageElement } from "../../report/domain/description/IPageElement.js";
import { IPageRenderer } from "../../report/domain/renderer/IPageRenderer.js";
import { IPageDesigner } from "../domain/IPageDesigner.js";
import { IPageDesignRenderer } from "../domain/IPageDesignRenderer.js";
import { PageDesignRenderer } from "./PageDesignRenderer.js";

export class PageDesigner implements IPageDesigner{
    private _renderer:IPageDesignRenderer;
    get renderer():IPageDesignRenderer{
        return this._renderer;
    }
    set renderer(value:IPageDesignRenderer){
        value.designer = this;
        value.designerDom = this.designerDom;
        value.popupDom = this.popupDom;
        value.toolbarDom = this.toolbarDom;
        this._renderer = value;
    }

    constructor(){
        this.renderer = new PageDesignRenderer();
        this.renderer.designer = this;
        this.renderer.designerDom = this.designerDom;
    }

    get designerDom(): HTMLElement{
        return this.renderer?.designerDom;
    }
    set designerDom(value:HTMLElement){
        this.renderer.designerDom = value;
    }
    get toolbarDom():HTMLElement{
        return this.renderer?.toolbarDom;
    }
    set toolbarDom(value:HTMLElement){
        this.renderer.toolbarDom = value;
    }
    get popupDom():HTMLElement{
        return this.renderer?.popupDom;
    }
    set popupDom(value:HTMLElement){
        this.renderer.popupDom = value;
    }

    document: IPage;
    selectedTarget: IPageElement;
    selectedTargets: IPageElement[] = [];
    addPageElement(pageElement?: IPageElement): IPageElement {
        let elemMerged = new DefaultValueCalculator<PageElement>()
        .calc(
            pageElement,
            new PageElement({
                size:new Size({
                    w:50,
                    h:30,
                    wUnit:'mm',
                    hUnit:'mm'
                }),
                position:new Position({
                    x:10,
                    y:10,
                    xUnit:'mm',
                    yUnit:'mm'
                }),
                padding:new Padding({
                   top:1,
                   left:1,
                   right:1,
                   bottom:1,
                   topUnit:'mm',
                   leftUnit:'mm',
                   rightUnit:'mm',
                   bottomUnit:'mm' 
                }),
                content:'示例文本',
                textSetting:new TextSetting({
                    horizentalAlign:'center',
                    verticalAlign:'center'
                }),
                border:new Border({
                    topWidth:1,
                    topWidthUnit:'mm',
                    topColor:'black',
                    bottomWidth:1,
                    bottomWidthUnit:'mm',
                    bottomColor:'black',
                    leftWidth:1,
                    leftWidthUnit:'mm',
                    leftColor:'black',
                    rightWidth:1,
                    rightWidthUnit:'mm',
                    rightColor:'black',
                    borderTopLeftRadiusWidthUnit:'mm',
                    borderTopRightRadiusWidthUnit:'mm',
                    borderBottomLeftRadiusWidthUnit:'mm',
                    borderBottomRightRadiusWidthUnit:'mm'
                })
            })
        );
        let elemAdd = new PageElement(elemMerged);
        this.document.elements.push(elemAdd);
        this.select(elemAdd);
        return elemAdd;
    }
    removePageElements(...pageElements: IPageElement[]): void {
        this.document.elements = this.document.elements.filter(t=>pageElements.indexOf(t) == -1);
        this.select(this.document.elements[0]);
    }
    select(...targets: IPageElement[]): void {
        this.selectedTargets = targets.filter(t=>this.document.elements.indexOf(t) != -1);
        this.selectedTarget = this.selectedTargets[0];
        this.refresh();
    }
    unselect(...targets: IPageElement[]): void {
        this.select(...this.selectedTargets.filter(t=>targets.indexOf(t) == -1));
        this.refresh();
    }
    create(): void {
        this.document = new Page();
        this.refresh();
    }
    open(document: IPage): void {
        this.document = document.clone();
        this.refresh();

    }
    save(): IPage {
        return this.document.clone();
    }

    refresh():void{
        const scrollX = this.designerDom.scrollLeft,scrollY = this.designerDom.scrollTop;
        this.designerDom.innerHTML = '';
        this.renderer.render(this.document,this.selectedTargets);
        this.designerDom.scrollLeft = scrollX;
        this.designerDom.scrollTop = scrollY;
    }

}