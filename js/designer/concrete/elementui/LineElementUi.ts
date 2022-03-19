import { DefaultValueCalculator } from "../../../report/concrete/defaultvalue/DefaultValueCalculator.js";
import { Position } from "../../../report/concrete/description/Position.js";
import { UnitConvert } from "../../../report/concrete/UnitConvert.js";
import { ILineElement } from "../../../report/domain/description/elements/ILineElement.js";
import { IPageElement } from "../../../report/domain/description/elements/IPageElement.js";
import { IPage } from "../../../report/domain/description/IPage.js";
import { IPosition } from "../../../report/domain/description/IPosition.js";
import { IBindingSource } from "../../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../report/domain/renderer/IObjectBoundingRect.js";
import { ILineElementUi } from "../../domain/elementui/ILineElementUi.js";
import { IPageDesigner } from "../../domain/IPageDesigner.js";
import { DefferMousedown } from "./DefferMousedown.js";
import { ElementBoxInformation } from "./ElementBoxInfomation.js";

type ScaleTypes = null|1|2;


export interface IDragable {
    scaletype: ScaleTypes;
    initialP1X: number;
    initialP1Y: number;
    lasttickP1X: number;
    lasttickP1Y: number;
    initialP2X: number;
    initialP2Y: number;
    lasttickP2X: number;
    lasttickP2Y: number;
    initialMousePositionX: number;
    initialMousePositionY: number;
    lasttickMousePositionX: number;
    lasttickMousePositionY: number;
}

type ElementNode = HTMLElement & IBindingSource<IPageElement> & IMeasuredBoundingRect & IObjectBoundingRect;
type QrcodeElementNode = ElementNode & IBindingSource<ILineElement>;
type SizeboxNode = SVGElement & IBindingSource<QrcodeElementNode> & IDragable;
type SizeboxScaleboxNode = SVGRectElement & IBindingSource<SizeboxNode> & { scaletype: ScaleTypes };

export class LineElementUi implements ILineElementUi{
    designer: IPageDesigner;
    private pageNode: HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect;
    render(element: ILineElement, node: HTMLElement & IBindingSource<ILineElement> & IMeasuredBoundingRect & IObjectBoundingRect, pageNode: HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect): void {
        this.pageNode = pageNode;
        //点击未选择元素时选中
        const nodeLine = node.querySelector('line');
        nodeLine.style.cursor = 'move';
        nodeLine.addEventListener('mousedown', (e) => this.elementnodeMouseDown(e));

        //放置尺寸框
        if (this.designer.selectedTargets.indexOf(node.sourceObject) != -1) {
            node.classList.add('selected');
            let sizebox = this.placeSizeBox(node);
            //工具栏操作按钮
            this.renderToolbarDom(element);
    
            //属性窗口显示元素属性编辑栏
            this.renderPopupDom(element);

            //如果是因为点击元素而触发的重绘，那么转发鼠标按下事件 实施拖动
            if (DefferMousedown.item != null && DefferMousedown.item.element == node.sourceObject) {
                sizebox.querySelector('line').dispatchEvent(new MouseEvent('mousedown', { buttons: 1, screenX: DefferMousedown.item.positionX, screenY: DefferMousedown.item.positionY }))
            }
        }
    }
    renderToolbarDom(element:ILineElement) {
        this.designer.toolbarDom.innerHTML = '';
        if(element == this.designer.selectedTarget){

        }
    }
    renderPopupDom(element:ILineElement) {
    }

     //#region  拖拽与选中

     elementnodeMouseDown(mouseEvent: MouseEvent): void {
        console.debug('element node mousedown', mouseEvent);
        mouseEvent.cancelBubble = true;
        //1.计算点选的元素
        //1.1.计算鼠标相对于documentDom的位置
        let elemnode = <ElementNode>mouseEvent.target;
        let clientX = mouseEvent.offsetX;
        let clientY = mouseEvent.offsetY;
        while (!elemnode.classList.contains('element-box')) {
            //line元素不需要加offsetLeft
            // clientX += elemnode.offsetLeft;
            // clientY += elemnode.offsetTop;
            elemnode = <ElementNode>elemnode.parentElement;
        }
        
        clientX += ElementBoxInformation.extractNumber(elemnode.style.left);
        clientY += ElementBoxInformation.extractNumber(elemnode.style.top);
        //1.2.计算点击位置下所有元素盒区域的交集
        
        const elemboxinfo = new ElementBoxInformation();
        elemboxinfo.designer = this.designer;
        const clickedElem = elemboxinfo.clickElement(clientX,clientY);
        DefferMousedown.item = {
            element: clickedElem,
            positionX: mouseEvent.screenX,
            positionY: mouseEvent.screenY
        };
        this.designer.select(clickedElem);
    }

    static locateLine(line:SVGLineElement,p1x:number,p1y:number,p2x:number,p2y:number,w:number,h:number){
        line.setAttribute('x1', `${p1x > p2x ? w : 0}`);//此处p1y和p2y顺序不能改变
        line.setAttribute('y1', `${p1y > p2y ? h : 0}`);
        line.setAttribute('x2', `${p2x > p1x ? w : 0}`);
        line.setAttribute('y2', `${p2y > p1y ? h : 0}`);
    }

    placeSizeBox(node: QrcodeElementNode): SizeboxNode {
        const sizebox = <SizeboxNode><unknown>document.createElementNS( 'http://www.w3.org/2000/svg','svg');
        sizebox.style.position = 'absolute';
        sizebox.style.boxSizing = 'border-box';
        sizebox.classList.add('size-box');

        sizebox.sourceObject = node;
        sizebox.scaletype = null;
        sizebox.initialP1X = 0;
        sizebox.initialP1Y = 0;
        sizebox.initialP2X = 0;
        sizebox.initialP2Y = 0;
        sizebox.initialMousePositionX = 0;
        sizebox.initialMousePositionY = 0;
        sizebox.lasttickMousePositionX = 0;
        sizebox.lasttickMousePositionY = 0;

        const defaultPosition = new Position({
            x:0,
            y:0,
            xUnit:this.designer.pageRenderer.options.defaultLengthUnit,
            yUnit:this.designer.pageRenderer.options.defaultLengthUnit
        });

        const p1 = new DefaultValueCalculator<IPosition>().calc(node.sourceObject.point1,defaultPosition),
        p2 = new DefaultValueCalculator<IPosition>().calc(node.sourceObject.point2,defaultPosition);
        const p1x = p1.x * UnitConvert.convertToPx(p1.xUnit),
        p1y = p1.y * UnitConvert.convertToPx(p1.yUnit),
        p2x = p2.x * UnitConvert.convertToPx(p2.xUnit),
        p2y = p2.y * UnitConvert.convertToPx(p2.yUnit);
        const x = Math.min(p1x,p2x),y = Math.min(p1y,p2y);
        const w = ElementBoxInformation.extractNumber(node.style.width),
        h=ElementBoxInformation.extractNumber(node.style.height);

        sizebox.setAttribute('viewBox',`0 0 ${w} ${h}`);
        sizebox.style.left = x + 'px';
        sizebox.style.top = y + 'px';
        sizebox.style.width = w + 'px';
        sizebox.style.height = h + 'px';
        
        //尺寸盒外观
        const sizeboxLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        sizeboxLine.style.cursor = 'move';
        sizebox.appendChild(sizeboxLine);
        LineElementUi.locateLine(sizeboxLine,p1x,p1y,p2x,p2y,w,h);

        sizeboxLine.style.stroke = 'gray';
        sizeboxLine.style.strokeWidth = '1';
        
        this.pageNode.appendChild(sizebox);


        //尺寸盒外观
        let p1box = this.generateSizeboxScalebox(sizebox);
        p1box.style.cursor = 'move';
        p1box.setAttribute('x',Number.parseFloat(sizeboxLine.getAttribute('x1'))-4+'');
        p1box.setAttribute('y',Number.parseFloat(sizeboxLine.getAttribute('y1'))-4+'');
        p1box.scaletype = 1;
        sizebox.appendChild(p1box);
        let p2box = this.generateSizeboxScalebox(sizebox);
        p2box.style.cursor = 'move';
        p2box.setAttribute('x',Number.parseFloat(sizeboxLine.getAttribute('x2'))-4+'');
        p2box.setAttribute('y',Number.parseFloat(sizeboxLine.getAttribute('y2'))-4+'');
        p2box.scaletype = 2;
        sizebox.appendChild(p2box);
        sizeboxLine.addEventListener('mousedown', (e) => this.sizeboxMoveareaMouseDown(e));

        this.pageNode.appendChild(sizebox);

        return sizebox;

    }

    generateSizeboxScalebox(sizebox: SizeboxNode): SizeboxScaleboxNode {
        let node = <SizeboxScaleboxNode><unknown>document.createElementNS('http://www.w3.org/2000/svg','rect');
        node.sourceObject = sizebox;
        node.classList.add('scale-box');

        node.style.stroke = 'gray';
        node.style.strokeWidth = '1';
        node.setAttribute('width','8');
        node.setAttribute('height', '8');

        node.addEventListener('mousedown', (e) => this.sizeboxScaleareaMouseDown(e));
        return node;
    }

    sizeboxMoveareaMouseDown(mouseEvent: MouseEvent): void {
        console.debug('move area mousedown', mouseEvent);
        if (mouseEvent.buttons != 1)
            return;
        let sizebox = <SizeboxNode>mouseEvent.target;
        if(!sizebox.classList.contains('size-box'))
            sizebox = <SizeboxNode><unknown>sizebox.parentElement;
        sizebox.scaletype = null;
        sizebox.initialP1X = sizebox.lasttickP1X = sizebox.sourceObject.sourceObject.point1.x * UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point1.xUnit ?? this.designer.pageRenderer.options.defaultLengthUnit);
        sizebox.initialP1Y = sizebox.lasttickP1Y = sizebox.sourceObject.sourceObject.point1.y * UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point1.yUnit ?? this.designer.pageRenderer.options.defaultLengthUnit);
        sizebox.initialP2X = sizebox.lasttickP2X = sizebox.sourceObject.sourceObject.point2.x * UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point2.xUnit ?? this.designer.pageRenderer.options.defaultLengthUnit);
        sizebox.initialP2Y = sizebox.lasttickP2Y = sizebox.sourceObject.sourceObject.point2.y * UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point2.yUnit ?? this.designer.pageRenderer.options.defaultLengthUnit);

        sizebox.initialMousePositionX = sizebox.lasttickMousePositionX = mouseEvent.screenX;
        sizebox.initialMousePositionY = sizebox.lasttickMousePositionY = mouseEvent.screenY;
        this.raiseDragging(sizebox);
        mouseEvent.cancelBubble = true;
    }

    sizeboxScaleareaMouseDown(mouseEvent: MouseEvent): void {
        console.debug('scale area mousedown', mouseEvent);
        let scalebox = <SizeboxScaleboxNode>mouseEvent.target;
        let sizebox = <SizeboxNode><unknown>scalebox.parentElement;
        sizebox.scaletype = scalebox.scaletype;
        sizebox.initialMousePositionX = sizebox.lasttickMousePositionX = mouseEvent.screenX;
        sizebox.initialMousePositionY = sizebox.lasttickMousePositionY = mouseEvent.screenY;
        sizebox.initialP1X = sizebox.lasttickP1X =  UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point1.xUnit ?? this.designer.pageRenderer.options.defaultLengthUnit) * sizebox.sourceObject.sourceObject.point1.x 
        sizebox.initialP1Y = sizebox.lasttickP1Y = UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point1.yUnit?? this.designer.pageRenderer.options.defaultLengthUnit) * sizebox.sourceObject.sourceObject.point1.y 
        sizebox.initialP2X = sizebox.lasttickP2X = UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point2.xUnit?? this.designer.pageRenderer.options.defaultLengthUnit) * sizebox.sourceObject.sourceObject.point2.x 
        sizebox.initialP2Y = sizebox.lasttickP2Y = UnitConvert.convertToPx(sizebox.sourceObject.sourceObject.point2.yUnit?? this.designer.pageRenderer.options.defaultLengthUnit) * sizebox.sourceObject.sourceObject.point2.y 

        this.raiseDragging(sizebox);
        mouseEvent.cancelBubble = true;
    }
    private sizeboxDraggingEdgesX:number[];
    private sizeboxDraggingEdgesY:number[];
    private sizeboxDraggingTarget: SizeboxNode;
    private sizeboxDraggingMousemoveStartup: boolean = true;
    raiseDragging(sizebox: SizeboxNode) {

        const elementBoxInfo = new ElementBoxInformation();
        elementBoxInfo.designer = this.designer;
        this.sizeboxDraggingEdgesX = [0,this.pageNode.offsetWidth].concat( elementBoxInfo.edgesX());
        this.sizeboxDraggingEdgesY = [0,this.pageNode.offsetHeight].concat(elementBoxInfo.edgesY());
        console.debug('edgesX',this.sizeboxDraggingEdgesX);
        console.debug('edgesY',this.sizeboxDraggingEdgesY);

        sizebox.querySelectorAll('.scale-box').forEach(elem => (<HTMLElement>elem).style.display = 'none');
        this.sizeboxDraggingTarget = sizebox;
        this.sizeboxDraggingMousemoveStartup = true;
        let movehandler = (e: MouseEvent) => this.sizeboxDraggingMouseMove(e);
        document.body.addEventListener('mousemove', movehandler);
        let uphandler = (e: MouseEvent) => {
            document.body.removeEventListener('mousemove', movehandler);
            document.body.removeEventListener('mouseup', uphandler);
            this.sizeboxDraggingMouseUp(e);
        }
        document.body.addEventListener('mouseup', uphandler);
    }
    sizeboxDraggingMouseMove(mouseEvent: MouseEvent): void {
        //只使用clientX和clientY处理事件
        if (this.sizeboxDraggingMousemoveStartup) {
            console.debug('sizebox mousemove', mouseEvent);
            this.sizeboxDraggingMousemoveStartup = false;
        }
        if (this.sizeboxDraggingTarget == null)
            return;
        if (this.sizeboxDraggingTarget.scaletype == null) {
            //位移型拖拽
            const defaultPosition = new Position({
                x:0,
                y:0,
                xUnit:this.designer.pageRenderer.options.defaultLengthUnit,
                yUnit:this.designer.pageRenderer.options.defaultLengthUnit
            });

            const moveX =  (mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX) / this.designer.designerScale,
            moveY = (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY) / this.designer.designerScale;

            let np1x = this.sizeboxDraggingTarget.initialP1X + moveX;
            let np2x = this.sizeboxDraggingTarget.initialP2X + moveX;
            let np1y = this.sizeboxDraggingTarget.initialP1Y + moveY;
            let np2y = this.sizeboxDraggingTarget.initialP2Y + moveY;
            //吸附边界
            const absDiff = (n:number,arr:number[],limit:number = 5)=>{
                const minAbs = arr.filter(t=>t!=null).sort((a,b)=>Math.abs(a-n)-Math.abs(b-n))[0];
                return Math.abs(n-minAbs) <= limit ? minAbs : null;
            }
            const tryCall = (n:number,fn:Function,...args:any[]):number=>{
                return fn(n,...args) ?? n;
            }
            const absDiffP1x = absDiff(np1x,this.sizeboxDraggingEdgesX);
            const absDiffP2x = absDiff(np2x,this.sizeboxDraggingEdgesX);
            const correctX = tryCall(0,absDiff,[absDiffP1x-np1x,absDiffP2x-np2x]);
            np1x += correctX;
            np2x += correctX;
            const absDiffP1y = absDiff(np1y,this.sizeboxDraggingEdgesY);
            const absDiffP2y = absDiff(np2y,this.sizeboxDraggingEdgesY);
            const correctY = tryCall(0,absDiff,[absDiffP1y-np1y,absDiffP2y-np2y]);
            np1y += correctY;
            np2y += correctY;

            //处理边界
            if (np1x < 0
                || np1x  > this.pageNode.offsetWidth
                || np2x < 0
                || np2x  > this.pageNode.offsetWidth) {
                np1x = this.sizeboxDraggingTarget.lasttickP1X;
                np2x = this.sizeboxDraggingTarget.lasttickP2X;
            }
            if (np1y < 0
                || np1y > this.pageNode.offsetHeight
                || np2y < 0
                || np2y > this.pageNode.offsetHeight) {
                    np1y = this.sizeboxDraggingTarget.lasttickP1Y;
                    np2y = this.sizeboxDraggingTarget.lasttickP2Y;
                }
                //应用更新            
            this.sizeboxDraggingTarget.style.left = ElementBoxInformation.extractNumber(this.sizeboxDraggingTarget.style.left) + np1x - this.sizeboxDraggingTarget.lasttickP1X + 'px';
            this.sizeboxDraggingTarget.style.top =  ElementBoxInformation.extractNumber(this.sizeboxDraggingTarget.style.top) + np1y - this.sizeboxDraggingTarget.lasttickP1Y + 'px';
            this.sizeboxDraggingTarget.lasttickP1X = np1x;
            this.sizeboxDraggingTarget.lasttickP1Y = np1y;
            this.sizeboxDraggingTarget.lasttickP2X = np2x;
            this.sizeboxDraggingTarget.lasttickP2Y = np2y;
            //处理内存对象
            this.sizeboxDraggingTarget.sourceObject.style.left = this.sizeboxDraggingTarget.style.left;
            this.sizeboxDraggingTarget.sourceObject.style.top = this.sizeboxDraggingTarget.style.top;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.x = np1x
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.y = np1y
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.xUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.yUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.x = np2x
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.y = np2y
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.xUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.yUnit = 'px';
        } else {
            //改变大小型拖拽
            const moveX = (mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX) / this.designer.designerScale,
            moveY = (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY) / this.designer.designerScale;

            const initialX = this.sizeboxDraggingTarget.scaletype ==  1 ? this.sizeboxDraggingTarget.initialP1X : this.sizeboxDraggingTarget.initialP2X,
            initialY = this.sizeboxDraggingTarget.scaletype ==  1 ? this.sizeboxDraggingTarget.initialP1Y : this.sizeboxDraggingTarget.initialP2Y,
            lasttickX = this.sizeboxDraggingTarget.scaletype ==  1 ? this.sizeboxDraggingTarget.lasttickP1X : this.sizeboxDraggingTarget.lasttickP2X,
            lasttickY = this.sizeboxDraggingTarget.scaletype ==  1 ? this.sizeboxDraggingTarget.lasttickP1Y : this.sizeboxDraggingTarget.lasttickP2Y;

            let x = initialX + moveX;
            let y = initialY + moveY;

             //吸附边界
             const absDiff = (n:number,arr:number[],limit:number = 5)=>{
                const minAbs = arr.filter(t=>t!=null).sort((a,b)=>Math.abs(a-n)-Math.abs(b-n))[0];
                return Math.abs(n-minAbs) <= limit ? minAbs : null;
            }
            const tryCall = (n:number,fn:Function,...args:any[]):number=>{
                return fn(n,...args) ?? n;
            }
            x = tryCall(x,absDiff,this.sizeboxDraggingEdgesX);
            y = tryCall(y,absDiff,this.sizeboxDraggingEdgesY);
            //处理边界
            if (x < 0
                || x  > this.pageNode.offsetWidth) {
                x = lasttickX;
            }
            if (y < 0
                || y > this.pageNode.offsetHeight) {
                y = lasttickY
            }  

            //处理按下shift的情况
            if(mouseEvent.shiftKey){
            const otherX = this.sizeboxDraggingTarget.scaletype ==  1 ? this.sizeboxDraggingTarget.initialP2X : this.sizeboxDraggingTarget.initialP1X,
            otherY = this.sizeboxDraggingTarget.scaletype ==  1 ? this.sizeboxDraggingTarget.initialP2Y : this.sizeboxDraggingTarget.initialP1Y;
                const diffX = Math.abs(x - otherX),diffY = Math.abs(y - otherY);
                if(diffX / diffY >= 3){
                    y = otherY;
                }else if(diffY / diffX >= 3){
                    x = otherX;
                }else{
                    x = Math.max(diffX,diffY) * Math.sign(x - otherX) + otherX;
                    y = Math.max(diffX,diffY) * Math.sign(y - otherY) + otherY;
                }
            }


            if(this.sizeboxDraggingTarget.scaletype == 1){
                //处理内存对象
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.x = x;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.y = y;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.xUnit = 'px';
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point1.yUnit = 'px';
                //应用更新
                this.sizeboxDraggingTarget.lasttickP1X = x;
                this.sizeboxDraggingTarget.lasttickP1Y = y;
            }else if(this.sizeboxDraggingTarget.scaletype == 2){
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.x = x;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.y = y;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.xUnit = 'px';
                this.sizeboxDraggingTarget.sourceObject.sourceObject.point2.yUnit = 'px';
                //应用更新
                this.sizeboxDraggingTarget.lasttickP2X = x;
                this.sizeboxDraggingTarget.lasttickP2Y = y;
            }

            const sx = Math.min(this.sizeboxDraggingTarget.lasttickP1X,this.sizeboxDraggingTarget.lasttickP2X),sy = Math.min(this.sizeboxDraggingTarget.lasttickP1Y,this.sizeboxDraggingTarget.lasttickP2Y);
            const w = Math.max(1,Math.abs(this.sizeboxDraggingTarget.lasttickP1X - this.sizeboxDraggingTarget.lasttickP2X)),
            h = Math.max(1,Math.abs(this.sizeboxDraggingTarget.lasttickP1Y - this.sizeboxDraggingTarget.lasttickP2Y));
            this.sizeboxDraggingTarget.style.left = sx + 'px';
            this.sizeboxDraggingTarget.style.top = sy + 'px';
            this.sizeboxDraggingTarget.style.width = w + 'px';
            this.sizeboxDraggingTarget.style.height = h + 'px';
            this.sizeboxDraggingTarget.setAttribute('viewBox',`0 0 ${w} ${h}`);
            LineElementUi.locateLine(
                this.sizeboxDraggingTarget.querySelector('line'),
                this.sizeboxDraggingTarget.lasttickP1X,
                this.sizeboxDraggingTarget.lasttickP1Y,
                this.sizeboxDraggingTarget.lasttickP2X,
                this.sizeboxDraggingTarget.lasttickP2Y,
                w,
                h
                )
        }
    }
    sizeboxDraggingMouseUp(mouseEvent: MouseEvent): void {
        console.debug('sizebox mouseup', mouseEvent)
        this.sizeboxDraggingTarget.querySelectorAll('.scale-box').forEach(elem => (<HTMLElement>elem).style.display = 'block');
        this.sizeboxDraggingTarget = null;
        //如果只是点击而没有拖拽，则取消选择
        if (this.sizeboxDraggingMousemoveStartup && DefferMousedown.item == null) {
            this.designer.select();
        }
        DefferMousedown.item = null;
        //刷新
        this.designer.refresh();
    }
    //#endregion

}