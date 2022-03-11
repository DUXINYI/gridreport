import { IPageElement } from "../../../report/domain/description/elements/IPageElement";
import { IPageDesigner } from "../../domain/IPageDesigner";

//此处参数用到的所有坐标都是相对于.page-box的px值
export class ElementBoxInformation{
    designer:IPageDesigner;
    static extractNumber(cssProperty:string){
        return Number.parseFloat(cssProperty.substring(0,cssProperty.length-2));
    }
    findDom(element:IPageElement){
        const idx = this.designer.document.elements.indexOf(element);
        let dom:HTMLElement | SVGAElement;
        this.designer.designerDom.querySelectorAll('.element-box').forEach(t=>{
            if(idx.toString() == t.getAttribute('data-element-index')){
                dom = <any>t;
            }
        })
        return dom;
    }
    //#region 元素盒属性
    left(element:IPageElement):number{
        let dom = this.findDom(element);
        if(dom instanceof SVGElement){
            return ElementBoxInformation.extractNumber(dom.style.left);
        }
        return dom.offsetLeft;
    }
    right(element:IPageElement):number{
        let dom = this.findDom(element);
        if(dom instanceof SVGElement){
            return ElementBoxInformation.extractNumber(dom.style.left) + ElementBoxInformation.extractNumber(dom.style.width);
        }
        return dom.offsetLeft + dom.offsetWidth;
    }
    top(element:IPageElement):number{
        let dom = this.findDom(element);
        if(dom instanceof SVGElement){
            return ElementBoxInformation.extractNumber(dom.style.top);
        }
        return dom.offsetTop;
    }
    bottom(element:IPageElement):number{
        let dom = this.findDom(element);
        if(dom instanceof SVGElement){
            return ElementBoxInformation.extractNumber(dom.style.top) + ElementBoxInformation.extractNumber(dom.style.height);
        }
        return dom.offsetTop + dom.offsetHeight;
    }
    width(element:IPageElement):number{
        let dom = this.findDom(element);
        if(dom instanceof SVGElement){
            return ElementBoxInformation.extractNumber(dom.style.width);
        }
        return dom.offsetWidth;
    }
    height(element:IPageElement):number{
        let dom = this.findDom(element);
        if(dom instanceof SVGElement){
            return ElementBoxInformation.extractNumber(dom.style.height);
        }
        return dom.offsetHeight;
    }
    //#endregion 元素盒属性
    //#region 属性计算值
    square(element:IPageElement){
        return this.width(element) * this.height(element);
    }
    //#endregion 属性计算值
    edgesX(elements?:IPageElement[]):number[]{
        if(elements == null)
        elements = this.designer.document.elements;
        return elements.map(t=>[this.left(t),this.right(t)]).reduce((acc,cur)=>acc.concat(cur));
    }
    edgesY(elements?:IPageElement[]):number[]{
        if(elements == null)
        elements = this.designer.document.elements;
        return elements.map(t=>[this.top(t),this.bottom(t)]).reduce((acc,cur)=>acc.concat(cur));
    }
    //#region 计算点击元素
    clickElement(x:number,y:number):IPageElement{
        //1.2.计算点击位置下所有元素盒区域的交集
        const elemboxinfo = this;
        elemboxinfo.designer = this.designer;
        let insideElements: IPageElement[] = [];
        let left = 0, top = 0, right = this.designer.designerDom.offsetWidth, bottom = this.designer.designerDom.offsetHeight;
        const insideElement = (elem: IPageElement) =>
            elemboxinfo.left(elem) <= x
            && elemboxinfo.right(elem) >= x
            && elemboxinfo.top(elem) <= y
            && elemboxinfo.bottom(elem) >= y;
        for (let elem of this.designer.document.elements) {
            if (insideElement(elem)) {
                insideElements.push(elem);
                if (left < elemboxinfo.left(elem))
                    left = elemboxinfo.left(elem);
                if (right > elemboxinfo.right(elem))
                    right = elemboxinfo.right(elem);
                if (top < elemboxinfo.top(elem))
                    top = elemboxinfo.top(elem);
                if (bottom > elemboxinfo.bottom(elem))
                    bottom = elemboxinfo.bottom(elem);
            }
        }
        //1.3.选择交集面积占比最小的元素
        const clickedElem = insideElements.sort((a: IPageElement, b: IPageElement) => elemboxinfo.square(a) - elemboxinfo.square(b))[0];
        return clickedElem;
    }
    //#endregion 计算点击元素
}