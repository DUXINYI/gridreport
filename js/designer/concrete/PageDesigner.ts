import { DefaultValueCalculator } from "../../report/concrete/defaultvalue/DefaultValueCalculator.js";
import { Border } from "../../report/concrete/description/Border.js";
import { Padding } from "../../report/concrete/description/Padding.js";
import { Page } from "../../report/concrete/description/Page.js";
import { Position } from "../../report/concrete/description/Position.js";
import { Size } from "../../report/concrete/description/Size.js";
import { TextSetting } from "../../report/concrete/description/TextSetting.js";
import { PageRenderer } from "../../report/concrete/renderer/PageRenderer.js";
import { IPage } from "../../report/domain/description/IPage.js";
import { ElementTypes, IPageElement } from "../../report/domain/description/elements/IPageElement.js";
import { IPageRenderer } from "../../report/domain/renderer/IPageRenderer.js";
import { IPageDesigner } from "../domain/IPageDesigner.js";
import { TextElement } from "../../report/concrete/description/elements/TextElement.js";
import { QrcodeElement } from "../../report/concrete/description/elements/QrcodeElement.js";
import { LineElement } from "../../report/concrete/description/elements/LineElement.js";
import { IPageUi } from "../domain/IPageUi.js";
import { PageUi } from "./PageUi.js";
import { PageElementUiParser } from "./elementui/PageElementUiParser.js";
import { PageElementRendererParser } from "../../report/concrete/renderer/elementrenderer/PageElementRendererParser.js";
import { SizeSquare } from "../../report/concrete/description/SizeSquare.js";
import { Color } from "../../report/concrete/description/Color.js";
import { ILineElement } from "../../report/domain/description/elements/ILineElement.js";
import { UnitConvert } from "../../report/concrete/UnitConvert.js";
import { ITextElement } from "../../report/domain/description/elements/ITextElement.js";
import { IQrcodeElement } from "../../report/domain/description/elements/IQrcodeElement.js";

export class PageDesigner implements IPageDesigner{
    pageUi: IPageUi;
    pageRenderer: IPageRenderer<HTMLElement>;
    private _designerScale: number = 1;
    get designerScale():number{
        return this._designerScale;
    }
    set designerScale(value:number){
        this._designerScale = value;
        this.refresh();
    }

    constructor(){
        this.pageRenderer = new PageRenderer({
            defaultLengthUnit:'mm',
            elementRendererParser:new PageElementRendererParser()
        })
       this.pageUi = new PageUi(this,new PageElementUiParser());
    }
    designerDom: HTMLElement;
    toolbarDom: HTMLElement;
    popupDom: HTMLElement;


    document: IPage;
    selectedTarget: IPageElement;
    selectedTargets: IPageElement[] = [];
    addPageElement(elementType: ElementTypes): IPageElement {
        let posX = 10,posY = 10;
        while(this.document.elements.find(t=>{
            if(t.elementType == 'line'){
                const line = <ILineElement>t;
                return Math.abs(UnitConvert.convertValueToPx(line.point1.x,line.point1.xUnit) - posX) < 10
                 && Math.abs(UnitConvert.convertValueToPx(line.point1.y,line.point1.yUnit) - posY) < 10 
                 || Math.abs(UnitConvert.convertValueToPx(line.point2.x,line.point2.xUnit) - posX) < 10
                 && Math.abs(UnitConvert.convertValueToPx(line.point2.y,line.point2.yUnit) - posY) < 10 ;
            }else{
                const other = <ITextElement | IQrcodeElement>t;
                return Math.abs(UnitConvert.convertValueToPx(other.position.x,other.position.xUnit) - posX) < 10
                && Math.abs(UnitConvert.convertValueToPx(other.position.y,other.position.yUnit) - posY) < 10;
            }
        })){
            posX += 20;
            posY += 20;
        }

        let elem:IPageElement;
        if(elementType == 'text')
            elem = new TextElement({
                size:new Size({
                    w:50,
                    h:30,
                    wUnit:'mm',
                    hUnit:'mm'
                }),
                position:new Position({
                    x:posX,
                    y:posY,
                    xUnit:'px',
                    yUnit:'px'
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
            });
        else if(elementType == 'qrcode')
            elem = new QrcodeElement({
                size:new SizeSquare({
                    l:150,
                    lUnit:'px'
                }),
                position:new Position({
                    x:posX,
                    y:posY,
                    xUnit:'px',
                    yUnit:'px'
                }),
                content:'实例文本'
            });
        else if(elementType == 'line')
            elem = new LineElement({
                point1:new Position({
                    x:posX,
                    y:posY,
                    xUnit:'px',
                    yUnit:'px'
                }),
                point2:new Position({
                    x:posX+100,
                    y:posY,
                    xUnit:'px',
                    yUnit:'px'
                }),
                color:'gray',
                lineWidth:1,
                lineStyle:'solid',
                lineWidthUnit:'mm'
            });
        else
            throw `不支持的元素类型${elementType}`;
        this.document.elements.push(elem);
        this.select(elem);
        return elem;
    }
    removePageElements(...pageElements: IPageElement[]): void {
        const selectAfterRemove = this.selectedTarget != null;
        this.document.elements = this.document.elements.filter(t=>pageElements.indexOf(t) == -1);
        if(selectAfterRemove)
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
        this.toolbarDom.innerHTML = '';
        this.popupDom.innerHTML = '';
        this.designerDom.innerHTML = '';
        this.pageUi.beforeRender();
        const documentDom = this.pageRenderer.render(this.document);
        this.designerDom.appendChild(documentDom);
        documentDom.style.transform = `scale(${this.designerScale})`;
        this.pageUi.render(this.document,documentDom);
        this.pageUi.afterRender();
        this.designerDom.scrollLeft = scrollX;
        this.designerDom.scrollTop = scrollY;
    }

}