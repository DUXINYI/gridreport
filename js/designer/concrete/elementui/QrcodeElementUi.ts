import { IPageElement } from "../../../report/domain/description/elements/IPageElement.js";
import { IQrcodeElement } from "../../../report/domain/description/elements/IQrcodeElement.js";
import { IPage } from "../../../report/domain/description/IPage.js";
import { IBindingSource } from "../../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../report/domain/renderer/IObjectBoundingRect.js";
import { IQrcodeElementUi } from "../../domain/elementui/IQrcodeElementUi.js";
import { IPageDesigner } from "../../domain/IPageDesigner.js";
import { NumberUnitInputDrawer } from "../htmldrawer/NumberUnitInputDrawer.js";
import { StringInputDrawer } from "../htmldrawer/StringInputDrawer.js";
import { DefferMousedown } from "./DefferMousedown.js";
import { ElementBoxInformation } from "./ElementBoxInfomation.js";

type ScaleTypes = null|'tl'|'tr'|'bl'|'br';


export interface IDragable {
    scaletype: ScaleTypes;
    initialTargetPositionX: number;
    initialTargetPositionY: number;
    lasttickTargetPositionX: number;
    lasttickTargetPositionY: number;
    initialMousePositionX: number;
    initialMousePositionY: number;
    lasttickMousePositionX: number;
    lasttickMousePositionY: number;
}

type ElementNode = HTMLElement & IBindingSource<IPageElement> & IMeasuredBoundingRect & IObjectBoundingRect;
type QrcodeElementNode = ElementNode & IBindingSource<IQrcodeElement>;
type SizeboxNode = HTMLElement & IBindingSource<QrcodeElementNode> & IDragable;
type SizeboxScaleboxNode = HTMLElement & IBindingSource<SizeboxNode> & { scaletype: ScaleTypes };

export class QrcodeElementUi implements IQrcodeElementUi{
    designer: IPageDesigner;

    private pageNode: HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect;

    render(element: IQrcodeElement, node: HTMLElement & IBindingSource<IQrcodeElement> & IMeasuredBoundingRect & IObjectBoundingRect, pageNode: HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect & IObjectBoundingRect): void {
        this.pageNode = pageNode;

        
        //点击未选择元素时选中
        node.style.cursor = 'move';
        node.addEventListener('mousedown', (e) => this.elementnodeMouseDown(e));

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
                sizebox.dispatchEvent(new MouseEvent('mousedown', { buttons: 1, screenX: DefferMousedown.item.positionX, screenY: DefferMousedown.item.positionY }))
            }
        }
    }

    renderToolbarDom(element:IQrcodeElement) {
        this.designer.toolbarDom.innerHTML = '';
        if(element == this.designer.selectedTarget){

        }
    }
    renderPopupDom(element:IQrcodeElement) {
        const genBlock = (host:HTMLElement) =>{
            const div = document.createElement('div');
            host.appendChild(div);
            return div;
        }
        const genPopupBlock = () => genBlock(this.designer.popupDom);
        this.designer.popupDom.innerHTML = '';
        if(this.designer.selectedTarget == element){
            

            const contentBlock = genPopupBlock();
            const contentDrawer = new StringInputDrawer('内容',true);
            contentDrawer.draw(genBlock(contentBlock),element.content,v=>{
                element.content = v;
                this.designer.refresh();
            });

            const unitCollection = ['mm','cm','px'];
            const positionBlock = genPopupBlock();
            const xDrawer = new NumberUnitInputDrawer('X',unitCollection,null);
            xDrawer.draw(
                genBlock(positionBlock),
                {
                    value: element.position.x,
                    valueUnit:element.position.xUnit
                },
                v=>{
                    element.position.x = v.value;
                    element.position.xUnit = v.valueUnit;
                    this.designer.refresh();
                });
            const yDrawer = new NumberUnitInputDrawer('Y',unitCollection,null);
            yDrawer.draw(
                genBlock(positionBlock),
                {
                    value:element.position.y,
                    valueUnit:element.position.yUnit
                },
                v=>{
                    element.position.y = v.value;
                    element.position.yUnit = v.valueUnit;
                    this.designer.refresh();
                });

            const sizeBlock = genPopupBlock();
            const wDrawer = new NumberUnitInputDrawer('宽',unitCollection,null);
            wDrawer.draw(
                genBlock(sizeBlock),
                {
                    value:element.size.w,
                    valueUnit:element.size.wUnit
                },
                v=>{
                    element.size.w = v.value;
                    element.size.wUnit = v.valueUnit;
                    this.designer.refresh();
                });
            const hDrawer = new NumberUnitInputDrawer('高',unitCollection,null);
            hDrawer.draw(
                genBlock(sizeBlock),
                {
                    value:element.size.h,
                    valueUnit:element.size.hUnit
                },
                v=>{
                    element.size.h = v.value;
                    element.size.hUnit = v.valueUnit;
                    this.designer.refresh();
                });
        }

    }

    //#region  拖拽与选中

    elementnodeMouseDown(mouseEvent: MouseEvent): void {
        console.debug('element node mousedown', mouseEvent);
        mouseEvent.cancelBubble = true;
        //1.计算点选的元素
        //1.1.计算鼠标相对于documentDom(.page-box)的位置
        let elemnode = <ElementNode>mouseEvent.target;
        let clientX = mouseEvent.offsetX;
        let clientY = mouseEvent.offsetY;
        while (!elemnode.classList.contains('element-box')) {
            clientX += elemnode.offsetLeft;
            clientY += elemnode.offsetTop;
            elemnode = <ElementNode>elemnode.parentElement;
        }
        clientX += elemnode.offsetLeft;
        clientY += elemnode.offsetTop;
        //1.2.计算点击位置下的元素
        const elemboxinfo = new ElementBoxInformation();
        elemboxinfo.designer = this.designer;
        const clickedElem = elemboxinfo.clickElement(clientX,clientY)
        DefferMousedown.item = {
            element: clickedElem,
            positionX: mouseEvent.screenX,
            positionY: mouseEvent.screenY
        };
        this.designer.select(clickedElem);
    }

    placeSizeBox(node: QrcodeElementNode): SizeboxNode {
        let sizebox = <SizeboxNode><unknown>document.createElement('div');
        sizebox.classList.add('size-box');
        sizebox.sourceObject = node;

        sizebox.scaletype = null;
        sizebox.initialTargetPositionX = 0;
        sizebox.initialTargetPositionY = 0;
        sizebox.initialMousePositionX = 0;
        sizebox.initialMousePositionY = 0;
        sizebox.lasttickMousePositionX = 0;
        sizebox.lasttickMousePositionY = 0;

        //尺寸盒位置
        sizebox.style.position = 'absolute';
        sizebox.style.left = node.style.left;
        sizebox.style.right = node.style.right;
        sizebox.style.top = node.style.top;
        sizebox.style.bottom = node.style.bottom;
        sizebox.style.width = node.style.width;
        sizebox.style.height = node.style.height;

        //尺寸盒外观
        sizebox.style.boxSizing = 'border-box';
        sizebox.style.border = '1px solid gray';
        sizebox.style.cursor = 'move';
        let tlbox = this.generateSizeboxScalebox(sizebox);
        tlbox.style.cursor = 'nw-resize';
        tlbox.style.left = '-4px';
        tlbox.style.top = '-4px';
        tlbox.scaletype = 'tl';
        sizebox.appendChild(tlbox);
        let blbox = this.generateSizeboxScalebox(sizebox);
        blbox.style.cursor = 'sw-resize';
        blbox.style.left = '-4px';
        blbox.style.top = node.objectBoundingRect.height - 2 + 'px';
        blbox.scaletype = 'bl';
        sizebox.appendChild(blbox);
        let trbox = this.generateSizeboxScalebox(sizebox);
        trbox.style.cursor = 'sw-resize';
        trbox.style.left = node.objectBoundingRect.width - 2 + 'px';
        trbox.style.top = '-4px';
        trbox.scaletype = 'tr';
        sizebox.appendChild(trbox);
        let brbox = this.generateSizeboxScalebox(sizebox);
        brbox.style.cursor = 'nw-resize';
        brbox.style.left = node.objectBoundingRect.width - 2 + 'px';
        brbox.style.top = node.objectBoundingRect.height - 2 + 'px';
        brbox.scaletype = 'br';
        sizebox.appendChild(brbox);

        sizebox.addEventListener('mousedown', (e) => this.sizeboxMoveareaMouseDown(e));

        this.pageNode.appendChild(sizebox);

        return sizebox;

    }

    generateSizeboxScalebox(sizebox: SizeboxNode): SizeboxScaleboxNode {
        let node = <SizeboxScaleboxNode><unknown>document.createElement('div');
        node.sourceObject = sizebox;
        node.classList.add('scale-box');

        node.style.boxSizing = 'border-box';
        node.style.position = 'absolute';

        node.style.border = '1px solid gray';
        node.style.width = '4px';
        node.style.height = '4px';

        node.addEventListener('mousedown', (e) => this.sizeboxScaleareaMouseDown(e));
        return node;
    }

    sizeboxMoveareaMouseDown(mouseEvent: MouseEvent): void {
        console.debug('move area mousedown', mouseEvent);
        if (mouseEvent.buttons != 1)
            return;
        let sizebox = <SizeboxNode>mouseEvent.target;
        sizebox.scaletype = null;
        sizebox.initialTargetPositionX = sizebox.lasttickTargetPositionX = sizebox.offsetLeft;
        sizebox.initialTargetPositionY = sizebox.lasttickTargetPositionY = sizebox.offsetTop;
        sizebox.initialMousePositionX = sizebox.lasttickMousePositionX = mouseEvent.screenX;
        sizebox.initialMousePositionY = sizebox.lasttickMousePositionY = mouseEvent.screenY;
        this.raiseDragging(sizebox);
        mouseEvent.cancelBubble = true;
    }

    sizeboxScaleareaMouseDown(mouseEvent: MouseEvent): void {
        console.debug('scale area mousedown', mouseEvent);
        let scalebox = <SizeboxScaleboxNode>mouseEvent.target;
        let sizebox = <SizeboxNode>scalebox.parentElement;
        sizebox.scaletype = scalebox.scaletype;
        sizebox.initialMousePositionX = sizebox.lasttickMousePositionX = mouseEvent.screenX;
        sizebox.initialMousePositionY = sizebox.lasttickMousePositionY = mouseEvent.screenY;
        sizebox.initialTargetPositionX = sizebox.lasttickTargetPositionX = sizebox.offsetWidth;
        sizebox.initialTargetPositionY = sizebox.lasttickTargetPositionY = sizebox.offsetHeight;
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
            const moveX =(mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX) / this.designer.designerScale,
            moveY = (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY) / this.designer.designerScale;

            let x = this.sizeboxDraggingTarget.initialTargetPositionX + moveX,
            y = this.sizeboxDraggingTarget.initialTargetPositionY + moveY;
            
            //吸附边界
            const absDiff = (n:number,arr:number[],limit:number = 5)=>{
                const minAbs = arr.filter(t=>t!=null).sort((a,b)=>Math.abs(a-n)-Math.abs(b-n))[0];
                return Math.abs(n-minAbs) <= limit ? minAbs : null;
            }
            const tryCall = (n:number,fn:Function,...args:any[]):number=>{
                return fn(n,...args) ?? n;
            }
            const stl = absDiff(x,this.sizeboxDraggingEdgesX),
            str = absDiff(x+this.sizeboxDraggingTarget.offsetWidth,this.sizeboxDraggingEdgesX)  - this.sizeboxDraggingTarget.offsetWidth;
            x = tryCall(x,absDiff,[stl,str]);
            const stt = absDiff(y,this.sizeboxDraggingEdgesY),
            stb = absDiff(y+this.sizeboxDraggingTarget.offsetHeight,this.sizeboxDraggingEdgesY) - this.sizeboxDraggingTarget.offsetHeight;
            y = tryCall(y,absDiff,[stt,stb]);


            //处理边界
            if (x < 0 || x + this.sizeboxDraggingTarget.offsetWidth > this.pageNode.offsetWidth) {
                x = this.sizeboxDraggingTarget.lasttickTargetPositionX;
            }
            if (y < 0 || y + this.sizeboxDraggingTarget.offsetHeight > this.pageNode.offsetHeight) {
                y = this.sizeboxDraggingTarget.lasttickTargetPositionY;
            }
            

            //应用更新            
            this.sizeboxDraggingTarget.style.left = x + 'px';
            this.sizeboxDraggingTarget.style.top = y + 'px';

            this.sizeboxDraggingTarget.lasttickMousePositionX = mouseEvent.screenX;
            this.sizeboxDraggingTarget.lasttickMousePositionY = mouseEvent.screenY;
            this.sizeboxDraggingTarget.lasttickTargetPositionX = x;
            this.sizeboxDraggingTarget.lasttickTargetPositionY = y;
            //处理内存对象
            this.sizeboxDraggingTarget.sourceObject.style.left = this.sizeboxDraggingTarget.style.left;
            this.sizeboxDraggingTarget.sourceObject.style.top = this.sizeboxDraggingTarget.style.top;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.x = this.sizeboxDraggingTarget.lasttickTargetPositionX;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.y = this.sizeboxDraggingTarget.lasttickTargetPositionY;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.xUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.yUnit = 'px';
        } else {
            //改变大小型拖拽
            const
            moveX = (mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX) / this.designer.designerScale,
            moveY = (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY) / this.designer.designerScale;

            const 
            top = this.sizeboxDraggingTarget.offsetTop,
            left = this.sizeboxDraggingTarget.offsetLeft,
            bottom = top + this.sizeboxDraggingTarget.offsetHeight,
            right = left + this.sizeboxDraggingTarget.offsetWidth;
         
            let  width = this.sizeboxDraggingTarget.initialTargetPositionX + moveX * (this.sizeboxDraggingTarget.scaletype.includes('l')?-1:1);
            let height = this.sizeboxDraggingTarget.initialTargetPositionY + moveY * (this.sizeboxDraggingTarget.scaletype.includes('t')?-1:1);

            width = height = Math.max(width,height);
            //吸附边界
            const absDiff = (n:number,arr:number[],limit:number = 5)=>{
                const minAbs = arr.filter(t=>t!=null).sort((a,b)=>Math.abs(a-n)-Math.abs(b-n))[0];
                return Math.abs(n-minAbs) <= limit ? minAbs : null;
            }
            const tryCall = (n:number,fn:Function,...args:any[]):number=>{
                return fn(n,...args) ?? n;
            }
            if(this.sizeboxDraggingTarget.scaletype.includes('l')){
                width =  right - tryCall(right - width,absDiff,this.sizeboxDraggingEdgesX);
            }else{
                width = tryCall(left + width,absDiff,this.sizeboxDraggingEdgesX) - left;
            }
            if(this.sizeboxDraggingTarget.scaletype.includes('t')){
                height =  bottom - tryCall(bottom - height,absDiff,this.sizeboxDraggingEdgesY) ;
            }else{
                height = tryCall(top + height,absDiff,this.sizeboxDraggingEdgesY) - top;
            }

            //处理边界
            if (height < 6 //sizebox边框宽3px，最小高度6px
            || bottom - height < 0) {
                height = this.sizeboxDraggingTarget.lasttickTargetPositionY;
            }
            if(width < 6
                || right - width < 0){
                    width = this.sizeboxDraggingTarget.lasttickTargetPositionX;
                }
            width = height = Math.min(width,height);
            //应用更新
            this.sizeboxDraggingTarget.lasttickTargetPositionX = width;
            this.sizeboxDraggingTarget.lasttickTargetPositionY = height;

            this.sizeboxDraggingTarget.style.left = this.sizeboxDraggingTarget.scaletype.includes('l') ? right - width + 'px' :  left + 'px';
            this.sizeboxDraggingTarget.style.top =this.sizeboxDraggingTarget.scaletype.includes('t') ? bottom - height + 'px' : top + 'px';
            this.sizeboxDraggingTarget.style.width = width + 'px';
            this.sizeboxDraggingTarget.style.height = height + 'px';
            //处理内存对象
            this.sizeboxDraggingTarget.sourceObject.style.left = this.sizeboxDraggingTarget.style.left;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.x = right - width;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.xUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.style.width = this.sizeboxDraggingTarget.style.width;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.size.w = width;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.size.wUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.style.top = this.sizeboxDraggingTarget.style.top;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.y = bottom - height;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.yUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.style.height = this.sizeboxDraggingTarget.style.height;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.size.h = height;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.size.hUnit = 'px';
           
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