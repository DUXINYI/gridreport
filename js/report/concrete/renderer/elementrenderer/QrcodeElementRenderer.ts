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
        qrcodeBox.style.backgroundSize = `${domRect.width}px ${domRect.height}px`;
        qrcodeBox.src = `${this.options?.qrcodeRequestUrl + formattedContent}`;
        qrcodeBox.alt = pageElement.content;
        qrcodeBox.onerror = function(evt){
            const qrcode = 'data:image/png;base64,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';
            qrcodeBox.src = qrcode;
            qrcodeBox.onerror = null;
        }

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