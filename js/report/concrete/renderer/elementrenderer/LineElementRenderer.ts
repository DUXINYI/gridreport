import { ILineElement } from "../../../domain/description/elements/ILineElement.js";
import { IPosition } from "../../../domain/description/IPosition.js";
import { ILineElementRenderer, ILineElementRendererOptions } from "../../../domain/renderer/elementrenderer/ILineElementRenderer.js";
import { IFormatResolver } from "../../../domain/renderer/formatresolver/IFormatResolver.js";
import { IBindingSource } from "../../../domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../domain/renderer/IObjectBoundingRect.js";
import { DefaultValueCalculator } from "../../defaultvalue/DefaultValueCalculator.js";
import { Position } from "../../description/Position.js";
import { UnitConvert } from "../../UnitConvert.js";

export class LineElementRenderer implements ILineElementRenderer<HTMLElement>{
    options:Partial<ILineElementRendererOptions>;
    constructor(options:Partial<ILineElementRendererOptions>) {
        this.options = options;
    }
    static locateLine(line:SVGLineElement,p1x:number,p1y:number,p2x:number,p2y:number,w:number,h:number){
        line.setAttribute('x1', `${p1x > p2x ? w : 0}`);//此处p1y和p2y顺序不能改变
        line.setAttribute('y1', `${p1y > p2y ? h : 0}`);
        line.setAttribute('x2', `${p2x > p1x ? w : 0}`);
        line.setAttribute('y2', `${p2y > p1y ? h : 0}`);
    }
    render(pageElement: ILineElement, parentNode: HTMLElement): HTMLElement & IMeasuredBoundingRect & IObjectBoundingRect & IBindingSource<ILineElement> {
        if (parentNode == null) {
            throw '请提供一个可以预放置元素的父级容器';
        }

        let dom = document.createElementNS( 'http://www.w3.org/2000/svg','svg');
        dom.style.position = 'absolute';
        dom.style.boxSizing = 'border-box';
        dom.classList.add('element-box');

        
        const defaultPosition = new Position({
            x:0,
            y:0,
            xUnit:this.options?.defaultLengthUnit,
            yUnit:this.options?.defaultLengthUnit
        });
        
        const point1 = new DefaultValueCalculator<IPosition>().calc(pageElement.point1,defaultPosition),
        point2 = new DefaultValueCalculator<IPosition>().calc(pageElement.point2,defaultPosition);
        const p1x = point1.x * UnitConvert.convertToPx(point1.xUnit),
        p1y = point1.y * UnitConvert.convertToPx(point1.yUnit),
        p2x = point2.x * UnitConvert.convertToPx(point2.xUnit),
        p2y = point2.y * UnitConvert.convertToPx(point2.yUnit);
        const x = Math.min(p1x,p2x),y = Math.min(p1y,p2y);
        const w = Math.max(pageElement.lineWidth * UnitConvert.convertToPx(pageElement.lineWidthUnit??this.options.defaultLengthUnit),Math.abs(p1x - p2x)),
        h = Math.max(pageElement.lineWidth * UnitConvert.convertToPx(pageElement.lineWidthUnit??this.options.defaultLengthUnit),Math.abs(p1y - p2y));
        
        dom.setAttribute('viewBox',`0 0 ${w} ${h}`);
        dom.style.left = x + 'px';
        dom.style.top = y + 'px';
        dom.style.width = w + 'px';
        dom.style.height = h + 'px';
        
        let lineDom = document.createElementNS('http://www.w3.org/2000/svg','line');
        dom.appendChild(lineDom);
        LineElementRenderer.locateLine(lineDom,p1x,p1y,p2x,p2y,w,h);
        lineDom.style.stroke = pageElement.color;
        lineDom.style.strokeWidth = `${pageElement.lineWidth}${pageElement.lineWidthUnit??this.options?.defaultLengthUnit}`;
        if(pageElement.lineStyle == 'dashed'){
            lineDom.style.strokeDasharray = `${pageElement.lineWidth*2}${pageElement.lineWidthUnit??this.options?.defaultLengthUnit} ${pageElement.lineWidth*2}${pageElement.lineWidthUnit??this.options?.defaultLengthUnit}`
        }else if(pageElement.lineStyle == 'dotted'){
            lineDom.style.strokeDasharray = `${pageElement.lineWidth}${pageElement.lineWidthUnit??this.options?.defaultLengthUnit} ${pageElement.lineWidth}${pageElement.lineWidthUnit??this.options?.defaultLengthUnit}`
        }
        
        parentNode.appendChild(dom);

        let ret:any = dom;
        ret.objectBoundingRect = dom.getBoundingClientRect();
        ret.measuredBoundingRect = dom.getBoundingClientRect();
        ret.sourceObject = pageElement;
        dom.remove();
        return ret;
    }

}