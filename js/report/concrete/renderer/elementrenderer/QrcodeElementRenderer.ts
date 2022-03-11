import { IQrcodeElement } from "../../../domain/description/elements/IQrcodeElement.js";
import { ITextElement } from "../../../domain/description/elements/ITextElement.js";
import { IQrcodeElementRenderer, IQrcodeElementRendererOptions } from "../../../domain/renderer/elementrenderer/IQrcodeElementRenderer.js";
import { IFormatResolver } from "../../../domain/renderer/formatresolver/IFormatResolver.js";
import { IBindingSource } from "../../../domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../domain/renderer/IObjectBoundingRect.js";
import { IRendererOptions } from "../../../domain/renderer/IRendererOptions.js";
import { BorderApplier } from "../../appliers/BorderApplier.js";
import { ColorApplier } from "../../appliers/ColorApplier.js";
import { PaddingApplier } from "../../appliers/PaddingApplier.js";
import { PositionApplier } from "../../appliers/PositionApplier.js";
import { SizeApplier } from "../../appliers/SizeApplier.js";
import { Border } from "../../description/Border.js";
import { Color } from "../../description/Color.js";
import { Padding } from "../../description/Padding.js";
import { Position } from "../../description/Position.js";
import { Size } from "../../description/Size.js";
import { SizeSquare } from "../../description/SizeSquare.js";

export class QrcodeElementRenderer implements IQrcodeElementRenderer<HTMLElement>{
    options: Partial<IQrcodeElementRendererOptions>;
    
    formatResolver: IFormatResolver;
    defaultLengthUnit: string;
    constructor(options:Partial<IQrcodeElementRendererOptions>) {
        this.options = options;
    }
    render(pageElement: IQrcodeElement, parentNode: HTMLElement): HTMLElement & IMeasuredBoundingRect & IObjectBoundingRect & IBindingSource<IQrcodeElement> {
        if (parentNode == null) {
            throw '请提供一个可以预放置元素的父级容器';
        }

        let dom = document.createElement('div');
        dom.style.boxSizing = 'border-box';
        dom.classList.add('element-box');

        new PositionApplier().apply(dom, pageElement.position, new Position({
            x:0,
            y:0,
            xUnit:this.options?.defaultLengthUnit,
            yUnit:this.options?.defaultLengthUnit
        }));
        new SizeApplier().apply(dom, pageElement.size, new SizeSquare( {
            w:0,
            h:0,
            l:0,
            wUnit:this.options?.defaultLengthUnit,
            hUnit:this.options?.defaultLengthUnit,
            lUnit:this.options?.defaultLengthUnit
        }));
        parentNode.appendChild(dom);
        const domRect = dom.getBoundingClientRect();

        let qrcodeBox = document.createElement('img');
        qrcodeBox.style.boxSizing = 'border-box';
        qrcodeBox.classList.add('qrcode-box');

        new ColorApplier().apply(qrcodeBox,pageElement.color,new Color({
            color:'black',
            backgroundColor:null
        }));
        
        dom.appendChild(qrcodeBox);

        //渲染二维码
        qrcodeBox.style.position = 'absolute';
        let formattedContent = '';
        if(this.options?.formatResolver == null){
            formattedContent = pageElement.content;
        }else{
            formattedContent = this.options?.formatResolver.parseContent(pageElement.content);
        }
        qrcodeBox.src = `${this.options?.qrcodeRequestUrl + formattedContent}`;
        qrcodeBox.style.backgroundSize = `${domRect.width}px ${domRect.height}px`;
        qrcodeBox.alt = pageElement.content;

        qrcodeBox.style.width = dom.style.width;
        qrcodeBox.style.left = '0';
        qrcodeBox.style.height = dom.style.height;
        qrcodeBox.style.top = '0';

        let ret:any = dom;
        ret.objectBoundingRect = domRect;
        ret.measuredBoundingRect = qrcodeBox.getBoundingClientRect();
        ret.sourceObject = pageElement;
        dom.remove();
        return ret;
    }
    
}