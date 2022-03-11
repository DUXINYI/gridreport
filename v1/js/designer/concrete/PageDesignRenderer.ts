import { PageRenderer } from "../../report/concrete/renderer/PageRenderer.js";
import { IPage } from "../../report/domain/description/IPage.js";
import { IPageElement } from "../../report/domain/description/IPageElement.js";
import { IBindingSource } from "../../report/domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../report/domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../report/domain/renderer/IObjectBoundingRect.js";
import { IPageDesigner } from "../domain/IPageDesigner.js";
import { IPageDesignRenderer } from "../domain/IPageDesignRenderer.js";
import { BooleanInputDrawer } from "./htmldrawer/BooleanInputDrawer.js";
import { NumberUnitInputDrawer } from "./htmldrawer/NumberUnitInputDrawer.js";
import { StringInputDrawer } from "./htmldrawer/StringInputDrawer.js";
import { UnitConvert } from "./UnitConvert.js";


export interface IDragable{
    scaletype:string;
    horizentalDraging:boolean;
    verticalDraging:boolean;
    initialTargetPositionX:number;
    initialTargetPositionY:number;
    lasttickTargetPositionX:number;
    lasttickTargetPositionY:number;
    initialMousePositionX:number;
    initialMousePositionY:number;
    lasttickMousePositionX:number;
    lasttickMousePositionY:number;
}

type ElementNode = HTMLElement & IBindingSource<IPageElement> & IMeasuredBoundingRect & IObjectBoundingRect;
type SizeboxNode = HTMLElement & IBindingSource< ElementNode> & IDragable;
type SizeboxScaleboxNode = HTMLElement & IBindingSource<SizeboxNode> & {scaletype:string};
type CacheItem = {type:string,sourceObject:any,dom:HTMLElement};

export class PageDesignRenderer extends PageRenderer implements IPageDesignRenderer{
    designer: IPageDesigner;
    _designerDom:HTMLElement;
    get designerDom(): HTMLElement{
        return this._designerDom;
    }
    set designerDom(value:HTMLElement){
        this._designerDom = value;
        if(this._designerDom == null)
        return;
        this._designerDom.addEventListener('mousedown',(e)=>{
            if(e.buttons == 1 && this.designer.selectedTarget){
                console.debug('designer dom mousedown, cancel select')
                this.designer.select();
                this._designerDom.dispatchEvent(new MouseEvent('mousedown',{
                    clientX:e.clientX,
                    clientY:e.clientY,
                    screenX:e.screenX,
                    screenY:e.screenY
                }));
            }
        });
    }
    popupDom: HTMLElement;
    toolbarDom: HTMLElement;
    
    elementBoxes:ElementNode[] = [];
    sizeBoxes:(HTMLElement & IBindingSource<ElementNode>)[] = [];
    private documentDom:HTMLElement;
    private lasttickSelectedTargets:IPageElement[] = [];

    render(page: IPage,selectedTargets?:IPageElement[]): HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect {
        this.elementBoxes.splice(0,this.elementBoxes.length);
        this.sizeBoxes.splice(0,this.sizeBoxes.length);
 
        let dom = super.render(page);

        this.designerDom.appendChild(dom);
        let domRect = dom.getBoundingClientRect();

        for(let i=0; i< dom.children.length;i++){
            if(dom.children[i].classList.contains('element-box')){
                let node = <ElementNode><unknown>dom.children[i];
                this.elementBoxes.push(node);
                //点击未选择元素时选中
                node.style.cursor = 'move';
                node.addEventListener('mousedown',(e)=>this.elementnodeMouseDown(e));

                //放置尺寸框
                if(selectedTargets.indexOf(node.sourceObject) != -1){
                    dom.children[i].classList.add('selected');
                    let sizebox = this.placeSizeBox(dom,node);

                    //如果是因为点击元素而触发的重绘，那么转发鼠标按下事件 实施拖动
                    if(this.defferMousedown != null && this.defferMousedown.element == node.sourceObject){
                        sizebox.dispatchEvent(new MouseEvent('mousedown',{buttons:1,screenX:this.defferMousedown.positionX,screenY:this.defferMousedown.positionY}))
                    }
                }
            }
        }

        //工具栏操作按钮
        this.renderToolbarDom(selectedTargets);
        
        //属性窗口显示元素属性编辑栏
        this.renderPopupDom(selectedTargets);
        
        this.lasttickSelectedTargets = selectedTargets;
        let domAny = <any>dom;
        domAny.measuredBoundingRect = domRect;
        this.documentDom = domAny;
        return domAny;
    }
    renderToolbarDom(selectedTargets:IPageElement[]){
        this.toolbarDom.innerHTML = '';
        if(selectedTargets.length == 1){

            let horizentalAlignLeftDiv = document.createElement('button');
            horizentalAlignLeftDiv.innerText = '左对齐';
            this.toolbarDom.appendChild(horizentalAlignLeftDiv);
            horizentalAlignLeftDiv.addEventListener('click',(e)=>{
                selectedTargets[0].textSetting.horizentalAlign = 'left';
                this.designer.refresh();
            })
            let horizentalAlignCenterDiv = document.createElement('button');
            horizentalAlignCenterDiv.innerText = '居中';
            this.toolbarDom.appendChild(horizentalAlignCenterDiv);
            horizentalAlignCenterDiv.addEventListener('click',(e)=>{
                selectedTargets[0].textSetting.horizentalAlign = 'center';
                this.designer.refresh();
            })
            let horizentalAlignRightDiv = document.createElement('button');
            horizentalAlignRightDiv.innerText = '右对齐';
            this.toolbarDom.appendChild(horizentalAlignRightDiv);
            horizentalAlignRightDiv.addEventListener('click',(e)=>{
                selectedTargets[0].textSetting.horizentalAlign = 'right';
                this.designer.refresh();
            })
            let vertialAlignTopDiv = document.createElement('button');
            vertialAlignTopDiv.innerText = '顶对齐';
            this.toolbarDom.appendChild(vertialAlignTopDiv);
            vertialAlignTopDiv.addEventListener('click',(e)=>{
                selectedTargets[0].textSetting.verticalAlign = 'top';
                this.designer.refresh();
            })
            let vertialAlignCenterDiv = document.createElement('button');
            vertialAlignCenterDiv.innerText = '居中';
            this.toolbarDom.appendChild(vertialAlignCenterDiv);
            vertialAlignCenterDiv.addEventListener('click',(e)=>{
                selectedTargets[0].textSetting.verticalAlign = 'center';
                this.designer.refresh();
            })
            let vertialAlignBottomDiv = document.createElement('button');
            vertialAlignBottomDiv.innerText = '底对齐';
            this.toolbarDom.appendChild(vertialAlignBottomDiv);
            vertialAlignBottomDiv.addEventListener('click',(e)=>{
                selectedTargets[0].textSetting.verticalAlign = 'bottom';
                this.designer.refresh();
            })
        }
    }
    renderPopupDom(selectedTargets:IPageElement[]){
        const genBlock = (host:HTMLElement) =>{
            const div = document.createElement('div');
            host.appendChild(div);
            return div;
        }
        const genPopupBlock = () => genBlock(this.popupDom);
        this.popupDom.innerHTML = '';
        if(selectedTargets.length == 1){
            const fitContentBlock = genPopupBlock();
            const fitWidthDrawer = new BooleanInputDrawer('自适应宽度');
            fitWidthDrawer.draw(genBlock(fitContentBlock),selectedTargets[0].fitContent.fitWidth,v=>{
                selectedTargets[0].fitContent.fitWidth = v;
                this.designer.refresh();
            });
            const fitHeightDrawer = new BooleanInputDrawer('自适应高度');
            fitHeightDrawer.draw(genBlock(fitContentBlock),selectedTargets[0].fitContent.fitHeight,v=>{
                selectedTargets[0].fitContent.fitHeight = v;
                this.designer.refresh();
            });

            const contentBlock = genPopupBlock();
            const contentDrawer = new StringInputDrawer('内容',true);
            contentDrawer.draw(genBlock(contentBlock),selectedTargets[0].content,v=>{
                selectedTargets[0].content = v;
                this.designer.refresh();
            });

            const unitCollection = ['mm','cm','px'];
            const positionBlock = genPopupBlock();
            const xDrawer = new NumberUnitInputDrawer('X',unitCollection,null);
            xDrawer.draw(
                genBlock(positionBlock),
                {
                    value: selectedTargets[0].position.x,
                    valueUnit:selectedTargets[0].position.xUnit
                },
                v=>{
                    selectedTargets[0].position.x = v.value;
                    selectedTargets[0].position.xUnit = v.valueUnit;
                    this.designer.refresh();
                });
            const yDrawer = new NumberUnitInputDrawer('Y',unitCollection,null);
            yDrawer.draw(
                genBlock(positionBlock),
                {
                    value:selectedTargets[0].position.y,
                    valueUnit:selectedTargets[0].position.yUnit
                },
                v=>{
                    selectedTargets[0].position.y = v.value;
                    selectedTargets[0].position.yUnit = v.valueUnit;
                    this.designer.refresh();
                });

            const sizeBlock = genPopupBlock();
            const wDrawer = new NumberUnitInputDrawer('宽',unitCollection,null);
            wDrawer.draw(
                genBlock(sizeBlock),
                {
                    value:selectedTargets[0].size.w,
                    valueUnit:selectedTargets[0].size.wUnit
                },
                v=>{
                    selectedTargets[0].size.w = v.value;
                    selectedTargets[0].size.wUnit = v.valueUnit;
                    this.designer.refresh();
                });
            const hDrawer = new NumberUnitInputDrawer('高',unitCollection,null);
            hDrawer.draw(
                genBlock(sizeBlock),
                {
                    value:selectedTargets[0].size.h,
                    valueUnit:selectedTargets[0].size.hUnit
                },
                v=>{
                    selectedTargets[0].size.h = v.value;
                    selectedTargets[0].size.hUnit = v.valueUnit;
                    this.designer.refresh();
                });
        }

    }
    //#region  拖拽与选中

    private defferMousedown:{element:IPageElement,positionX:number,positionY:number};
    elementnodeMouseDown(mouseEvent:MouseEvent):void{
        console.debug('element node mousedown',mouseEvent);
        mouseEvent.cancelBubble = true;
        //1.计算点选的元素
        //1.1.计算鼠标相对于documentDom的位置
        let elemnode = <ElementNode>mouseEvent.target;
        let clientX = mouseEvent.offsetX;
        let clientY = mouseEvent.offsetY;
        while(!elemnode.classList.contains('element-box')){
            clientX += elemnode.offsetLeft ;
            clientY += elemnode.offsetTop;
            elemnode = <ElementNode>elemnode.parentElement;
        }
        clientX += elemnode.offsetLeft;
        clientY += elemnode.offsetTop;
        //1.2.计算点击位置下所有元素盒区域的交集
        let insideElements:ElementNode[] = [];
        let left = 0 ,top = 0,right = this.documentDom.offsetWidth,bottom = this.documentDom.offsetHeight;
        const elemRight = (elem:HTMLElement) => elem.offsetLeft + elem.offsetWidth;
        const elemBottom = (elem:HTMLElement) => elem.offsetTop + elem.offsetHeight;
        const insideElement = (elem:ElementNode) => 
            elem.offsetLeft <= clientX 
            && elemRight(elem) >= clientX
            && elem.offsetTop <= clientY 
            && elemBottom(elem) >= clientY;
        for(let elembox of this.elementBoxes){
            if(insideElement(elembox)){
                insideElements.push(elembox);
                if(left < elembox.offsetLeft)
                    left = elembox.offsetLeft;
                if(right > elemRight(elembox))
                    right = elemRight(elembox);
                if(top < elembox.offsetTop)
                    top = elembox.offsetTop;
                if(bottom > elemBottom(elembox))
                    bottom = elemBottom(elembox);
            }
        }
        //1.3.选择交集面积占比最小的元素
        const square = (right - left) * (bottom - top);
        const elemSquare = (elem:HTMLElement) => (elemRight(elem) - elem.offsetLeft) * (elemBottom(elem) - elem.offsetTop);
        const clickedElem = insideElements.sort((a:ElementNode,b:ElementNode)=>elemSquare(a) - elemSquare(b))[0];
        this.defferMousedown = {
            element:clickedElem.sourceObject,
            positionX:mouseEvent.screenX,
            positionY:mouseEvent.screenY
        };
        this.designer.select(clickedElem.sourceObject);
    }

    placeSizeBox(dom:HTMLElement,node:ElementNode):SizeboxNode{
        let sizebox = <SizeboxNode><unknown>document.createElement('div');
        sizebox.classList.add('size-box');
        sizebox.sourceObject = node;

        sizebox.scaletype = null;
        sizebox.horizentalDraging = false;
        sizebox.verticalDraging = false;
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
        let lbox = this.generateSizeboxScalebox(sizebox);
        lbox.style.cursor = 'ew-resize';
        lbox.style.left = '-4px';
        lbox.style.top = node.objectBoundingRect.height / 2 - 2 + 'px';
        lbox.scaletype = 'l';
        sizebox.appendChild(lbox);
        let blbox = this.generateSizeboxScalebox(sizebox);
        blbox.style.cursor = 'sw-resize';
        blbox.style.left = '-4px';
        blbox.style.top = node.objectBoundingRect.height - 2 + 'px';
        blbox.scaletype = 'bl';
        sizebox.appendChild(blbox);
        let tbox = this.generateSizeboxScalebox(sizebox);
        tbox.style.cursor = 'ns-resize';
        tbox.style.left = node.objectBoundingRect.width / 2 - 2 + 'px';
        tbox.style.top = '-4px';
        tbox.scaletype = 't';
        sizebox.appendChild(tbox);
        let bbox = this.generateSizeboxScalebox(sizebox);
        bbox.style.cursor = 'ns-resize';
        bbox.style.left = node.objectBoundingRect.width / 2 - 2 + 'px';
        bbox.style.top =  node.objectBoundingRect.height - 2 + 'px';
        bbox.scaletype = 'b';
        sizebox.appendChild(bbox);
        let trbox = this.generateSizeboxScalebox(sizebox);
        trbox.style.cursor = 'sw-resize';
        trbox.style.left = node.objectBoundingRect.width - 2 + 'px';
        trbox.style.top =  '-4px';
        trbox.scaletype = 'tr';
        sizebox.appendChild(trbox);
        let rbox = this.generateSizeboxScalebox(sizebox);
        rbox.style.cursor = 'ew-resize';
        rbox.style.left = node.objectBoundingRect.width - 2 + 'px';
        rbox.style.top =  node.objectBoundingRect.height / 2 - 2 + 'px';
        rbox.scaletype = 'r';
        sizebox.appendChild(rbox);
        let brbox = this.generateSizeboxScalebox(sizebox);
        brbox.style.cursor = 'nw-resize';
        brbox.style.left = node.objectBoundingRect.width - 2 + 'px';
        brbox.style.top =  node.objectBoundingRect.height - 2 + 'px';
        brbox.scaletype = 'br';
        sizebox.appendChild(brbox);

        sizebox.addEventListener('mousedown',(e)=>this.sizeboxMoveareaMouseDown(e));

        this.sizeBoxes.push(sizebox);
        dom.appendChild(sizebox);

        return sizebox;

    }

    generateSizeboxScalebox(sizebox:SizeboxNode):SizeboxScaleboxNode {
        let node = <SizeboxScaleboxNode><unknown>document.createElement('div');
        node.sourceObject = sizebox;
        node.classList.add('scale-box');

        node.style.boxSizing = 'border-box';
        node.style.position = 'absolute';

        node.style.border = '1px solid gray';
        node.style.width = '4px';
        node.style.height = '4px';

        node.addEventListener('mousedown',(e)=>this.sizeboxScaleareaMouseDown(e));
        return node;
    }

    sizeboxMoveareaMouseDown(mouseEvent:MouseEvent):void{
        console.debug('move area mousedown',mouseEvent);
        if(mouseEvent.buttons != 1)
        return;
        let sizebox = <SizeboxNode>mouseEvent.target;
        sizebox.scaletype = null;
        sizebox.verticalDraging = false;
        sizebox.horizentalDraging = false;
        sizebox.initialTargetPositionX = sizebox.lasttickTargetPositionX = sizebox.offsetLeft;
        sizebox.initialTargetPositionY = sizebox.lasttickTargetPositionY = sizebox.offsetTop;
        sizebox.initialMousePositionX = sizebox.lasttickMousePositionX = mouseEvent.screenX;
        sizebox.initialMousePositionY = sizebox.lasttickMousePositionY = mouseEvent.screenY;
        this.raiseDragging(sizebox);
        mouseEvent.cancelBubble = true;
    }

    sizeboxScaleareaMouseDown(mouseEvent:MouseEvent):void{
        console.debug('scale area mousedown',mouseEvent);
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
    sizeboxDraggingTarget:SizeboxNode;
    sizeboxDraggingMousemoveStartup:boolean = true;
    raiseDragging(sizebox:SizeboxNode){
        sizebox.querySelectorAll('.scale-box').forEach(elem=>(<HTMLElement>elem).style.display = 'none');
        this.sizeboxDraggingTarget = sizebox;
        this.sizeboxDraggingMousemoveStartup = true;
        let movehandler = (e:MouseEvent)=>this.sizeboxDraggingMouseMove(e);
        document.body.addEventListener('mousemove',movehandler);
        let uphandler = (e:MouseEvent)=>{
            document.body.removeEventListener('mousemove',movehandler);
            document.body.removeEventListener('mouseup',uphandler);
            this.sizeboxDraggingMouseUp(e);
        }
        document.body.addEventListener('mouseup',uphandler);
    }
    sizeboxDraggingMouseMove(mouseEvent:MouseEvent):void{
        //只使用clientX和clientY处理事件
        if(this.sizeboxDraggingMousemoveStartup){
            console.debug('sizebox mousemove',mouseEvent);
            this.sizeboxDraggingMousemoveStartup = false;
        }
        if(this.sizeboxDraggingTarget == null)
            return;
        if(this.sizeboxDraggingTarget.scaletype == null){
            //位移型拖拽
            this.sizeboxDraggingTarget.style.left = this.sizeboxDraggingTarget.initialTargetPositionX + (mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX) + 'px';
            this.sizeboxDraggingTarget.style.top = this.sizeboxDraggingTarget.initialTargetPositionY + (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY) + 'px';
            this.sizeboxDraggingTarget.lasttickMousePositionX = mouseEvent.screenX;
            this.sizeboxDraggingTarget.lasttickMousePositionY = mouseEvent.screenY;
            //处理边界
            if(this.sizeboxDraggingTarget.offsetLeft < 0 
                || this.sizeboxDraggingTarget.offsetLeft + this.sizeboxDraggingTarget.offsetWidth > this.documentDom.offsetWidth){
                this.sizeboxDraggingTarget.style.left = this.sizeboxDraggingTarget.lasttickTargetPositionX + 'px';
            }
            if( this.sizeboxDraggingTarget.offsetTop < 0
                || this.sizeboxDraggingTarget.offsetTop + this.sizeboxDraggingTarget.offsetHeight > this.documentDom.offsetHeight){
                this.sizeboxDraggingTarget.style.top  = this.sizeboxDraggingTarget.lasttickTargetPositionY + 'px';
            }
            //应用更新            
            this.sizeboxDraggingTarget.lasttickTargetPositionX = this.sizeboxDraggingTarget.offsetLeft;
            this.sizeboxDraggingTarget.lasttickTargetPositionY = this.sizeboxDraggingTarget.offsetTop; 
            //处理内存对象
            this.sizeboxDraggingTarget.sourceObject.style.left = this.sizeboxDraggingTarget.style.left;
            this.sizeboxDraggingTarget.sourceObject.style.top = this.sizeboxDraggingTarget.style.top;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.x = this.sizeboxDraggingTarget.lasttickTargetPositionX;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.y = this.sizeboxDraggingTarget.lasttickTargetPositionY;
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.xUnit = 'px';
            this.sizeboxDraggingTarget.sourceObject.sourceObject.position.yUnit = 'px';
        }else {
            //改变大小型拖拽
            this.sizeboxDraggingTarget.lasttickMousePositionX = mouseEvent.screenX;
            this.sizeboxDraggingTarget.lasttickMousePositionY = mouseEvent.screenY;
            if(this.sizeboxDraggingTarget.scaletype.includes('l'))
                calcLeftResize.call(this);
            if(this.sizeboxDraggingTarget.scaletype.includes('r'))
                calcRightResize.call(this);
            if(this.sizeboxDraggingTarget.scaletype.includes('t'))
                calcTopResize.call(this);
            if(this.sizeboxDraggingTarget.scaletype.includes('b'))
                calcBottomResize.call(this);
            function calcTopResize():void{
                const bottom = this.sizeboxDraggingTarget.offsetTop + this.sizeboxDraggingTarget.offsetHeight;
                let height = this.sizeboxDraggingTarget.initialTargetPositionY - (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY);
                //处理边界
                if(height < 6 //sizebox边框宽3px，最小高度6px
                    || bottom - height < 0){
                        height = this.sizeboxDraggingTarget.lasttickTargetPositionY;
                    }
                    this.sizeboxDraggingTarget.style.top = bottom - height + 'px';
                    this.sizeboxDraggingTarget.style.height = height + 'px';
                    //应用更新
                    this.sizeboxDraggingTarget.lasttickTargetPositionY = height;
                    //处理内存对象
                    this.sizeboxDraggingTarget.sourceObject.style.top = this.sizeboxDraggingTarget.style.top;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.position.y = bottom - height;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.position.yUnit = 'px';
                    this.sizeboxDraggingTarget.sourceObject.style.height = this.sizeboxDraggingTarget.style.height;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.size.h = height;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.size.hUnit = 'px';

            }
            function calcLeftResize():void{
                const right = this.sizeboxDraggingTarget.offsetLeft + this.sizeboxDraggingTarget.offsetWidth;
                let width = this.sizeboxDraggingTarget.initialTargetPositionX - (mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX);
                //处理边界
                if(width < 6//sizebox边框宽3px，最小宽度6px
                    || right - width < 0){
                        width = this.sizeboxDraggingTarget.lasttickTargetPositionX;
                    }
                    this.sizeboxDraggingTarget.style.left = right - width + 'px';
                    this.sizeboxDraggingTarget.style.width = width + 'px';
                    //应用更新
                    this.sizeboxDraggingTarget.lasttickTargetPositionX = width;
                    //处理内存对象
                    this.sizeboxDraggingTarget.sourceObject.style.left = this.sizeboxDraggingTarget.style.left;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.position.x = right - width;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.position.xUnit = 'px';
                    this.sizeboxDraggingTarget.sourceObject.style.width = this.sizeboxDraggingTarget.style.width;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.size.w = width;
                    this.sizeboxDraggingTarget.sourceObject.sourceObject.size.wUnit = 'px';
            }
            function calcBottomResize():void{
                this.sizeboxDraggingTarget.style.height = this.sizeboxDraggingTarget.initialTargetPositionY + (mouseEvent.screenY - this.sizeboxDraggingTarget.initialMousePositionY) + 'px';
                //处理边界
                if(this.sizeboxDraggingTarget.offsetTop + this.sizeboxDraggingTarget.offsetHeight > this.documentDom.offsetHeight){
                    this.sizeboxDraggingTarget.style.height = this.sizeboxDraggingTarget.lasttickTargetPositionY + 'px';
                }
                //应用更新
                this.sizeboxDraggingTarget.lasttickTargetPositionY = this.sizeboxDraggingTarget.offsetHeight;
                //处理内存对象
                this.sizeboxDraggingTarget.sourceObject.style.height = this.sizeboxDraggingTarget.style.height;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.size.h = this.sizeboxDraggingTarget.lasttickTargetPositionY;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.size.hUnit = 'px';
            }
            function calcRightResize():void{
                this.sizeboxDraggingTarget.style.width = this.sizeboxDraggingTarget.initialTargetPositionX + (mouseEvent.screenX - this.sizeboxDraggingTarget.initialMousePositionX) + 'px';
                //处理边界
                if(this.sizeboxDraggingTarget.offsetLeft + this.sizeboxDraggingTarget.offsetWidth > this.documentDom.offsetWidth){
                    this.sizeboxDraggingTarget.style.width = this.sizeboxDraggingTarget.lasttickTargetPositionX + 'px';
                }
                //应用更新
                this.sizeboxDraggingTarget.lasttickTargetPositionX = this.sizeboxDraggingTarget.offsetWidth;
                //处理内存对象
                this.sizeboxDraggingTarget.sourceObject.style.width = this.sizeboxDraggingTarget.style.width;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.size.w = this.sizeboxDraggingTarget.lasttickTargetPositionX;
                this.sizeboxDraggingTarget.sourceObject.sourceObject.size.wUnit = 'px';
            }
        }
    }
    sizeboxDraggingMouseUp(mouseEvent:MouseEvent):void{
        console.debug('sizebox mouseup',mouseEvent)
        this.sizeboxDraggingTarget.querySelectorAll('.scale-box').forEach(elem=>(<HTMLElement>elem).style.display = 'block');
        this.sizeboxDraggingTarget = null;
        //如果只是点击而没有拖拽，则取消选择
        if(this.sizeboxDraggingMousemoveStartup && this.defferMousedown == null){
            this.designer.select();
        }
        this.defferMousedown = null;
        //刷新
        this.designer.refresh();
    }
    //#endregion
}