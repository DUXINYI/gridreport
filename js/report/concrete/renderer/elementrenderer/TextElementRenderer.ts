import { ITextElement } from "../../../domain/description/elements/ITextElement.js";
import { ITextSetting } from "../../../domain/description/ITextSetting.js";
import { ITextElementRenderer, ITextElementRendererOptions } from "../../../domain/renderer/elementrenderer/ITextElementRenderer.js";
import { IFormatResolver } from "../../../domain/renderer/formatresolver/IFormatResolver.js";
import { IBindingSource } from "../../../domain/renderer/IBindingSource.js";
import { IMeasuredBoundingRect } from "../../../domain/renderer/IMeasuredBoundingRect.js";
import { IObjectBoundingRect } from "../../../domain/renderer/IObjectBoundingRect.js";
import { IRendererOptions } from "../../../domain/renderer/IRendererOptions.js";
import { BorderApplier } from "../../appliers/BorderApplier.js";
import { ColorApplier } from "../../appliers/ColorApplier.js";
import { FontApplier } from "../../appliers/FontApplier.js";
import { PaddingApplier } from "../../appliers/PaddingApplier.js";
import { PositionApplier } from "../../appliers/PositionApplier.js";
import { SizeApplier } from "../../appliers/SizeApplier.js";
import { DefaultValueCalculator } from "../../defaultvalue/DefaultValueCalculator.js";
import { Border } from "../../description/Border.js";
import { Color } from "../../description/Color.js";
import { Font } from "../../description/Font.js";
import { Padding } from "../../description/Padding.js";
import { Position } from "../../description/Position.js";
import { Size } from "../../description/Size.js";
import { TextSetting } from "../../description/TextSetting.js";

export class TextElementRenderer implements ITextElementRenderer<HTMLElement>{
    
    options: Partial<ITextElementRendererOptions>;
    
    constructor(options:Partial<ITextElementRendererOptions>) {
        this.options = options;
    }

    render(pageElement: ITextElement, parentNode: HTMLElement): HTMLElement & IMeasuredBoundingRect & IObjectBoundingRect & IBindingSource<ITextElement> {
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
        new SizeApplier().apply(dom, pageElement.size, new Size( {
            w:0,
            h:0,
            wUnit:this.options?.defaultLengthUnit,
            hUnit:this.options?.defaultLengthUnit
        }));
        parentNode.appendChild(dom);

        let txtBox = document.createElement('div');
        txtBox.style.boxSizing = 'border-box';
        txtBox.classList.add('text-box');

        new FontApplier().apply(txtBox, pageElement.font, new Font({
            fontFamily:null,
            fontSize:10,
            fontSizeUnit:this.options?.defaultLengthUnit,
            isBold:false,
            isItalic:false,
            isUnderline:false,
        }));
        new ColorApplier().apply(txtBox,pageElement.color,new Color({
            color:'black',
            backgroundColor:null
        }));
        new BorderApplier().apply(txtBox, pageElement.border, new Border({
            leftColor:null,
            rightColor:null,
            topColor:null,
            bottomColor:null,
            leftStyle:null,
            rightStyle:null,
            topStyle:null,
            bottomStyle:null,
            leftWidth:0,
            rightWidth:0,
            topWidth:0,
            bottomWidth:0,
            leftWidthUnit:this.options?.defaultLengthUnit,
            rightWidthUnit:this.options?.defaultLengthUnit,
            topWidthUnit:this.options?.defaultLengthUnit,
            bottomWidthUnit:this.options?.defaultLengthUnit,
            borderTopLeftRadiusWidth:0,
            borderTopRightRadiusWidth:0,
            borderBottomLeftRadiusWidth:0,
            borderBottomRightRadiusWidth:0,
            borderTopLeftRadiusWidthUnit:this.options?.defaultLengthUnit,
            borderTopRightRadiusWidthUnit:this.options?.defaultLengthUnit,
            borderBottomLeftRadiusWidthUnit:this.options?.defaultLengthUnit,
            borderBottomRightRadiusWidthUnit:this.options?.defaultLengthUnit
        }));
        new PaddingApplier().apply(txtBox, pageElement.padding, new Padding( {
            left:0,
            leftUnit:this.options?.defaultLengthUnit,
            right:0,
            rightUnit:this.options?.defaultLengthUnit,
            top:0,
            topUnit:this.options?.defaultLengthUnit,
            bottom:0,
            bottomUnit:this.options?.defaultLengthUnit
        }));
        dom.appendChild(txtBox);

        let domRect = dom.getBoundingClientRect();

        //预渲染文字
        txtBox.style.overflowWrap = pageElement.textSetting.isWrapping ? 'anywhere' : 'revert';
        txtBox.style.whiteSpace = pageElement.textSetting.isWrapping ? '' : 'pre';
        txtBox.style.position = 'absolute';
        txtBox.style.lineBreak = 'anywhere';
        
        if(this.options?.formatResolver == null){
            txtBox.innerText = pageElement.content;
        }else{
            txtBox.innerText = this.options.formatResolver.parseContent(pageElement.content);
        }
        let txtRect = txtBox.getBoundingClientRect();
        //文字超出内容区域时需要剪裁
        if (txtRect.width > domRect.width || txtRect.height > domRect.height) {
            if (!this.cutText(txtBox, domRect.width, domRect.height)) {
                txtBox.remove();
                dom.remove();
                let ret:any = dom;
                ret.objectBoundingRect = domRect;
                ret.measuredBoundingRect = null;
                ret.sourceObject = pageElement;
                return ret;
            }
            txtRect = txtBox.getBoundingClientRect();
        }

        let textSetting = new DefaultValueCalculator<ITextSetting>()
        .calc(
            pageElement.textSetting,
            new TextSetting({
                horizentalAlign:'left',
                verticalAlign:'top',
                isWrapping:true
            }));
        //处理自适应大小和内容对齐
        txtBox.style.display = 'flex';
        if (pageElement.fitContent.fitWidth) {
            txtBox.style.width = txtRect.width + 'px';
            if (textSetting.horizentalAlign == 'left') {
                txtBox.style.left = '0';
            } else if (textSetting.horizentalAlign == 'center') {
                txtBox.style.left = (domRect.width - txtRect.width) / 2 + 'px';
            } else if (textSetting.horizentalAlign == 'right') {
                txtBox.style.right = '0';
            }
        } else {
            txtBox.style.width = dom.style.width;
            txtBox.style.left = '0';
        }
        if(pageElement.textSetting.horizentalAlign == 'left'){
            txtBox.style.justifyContent = 'start';
        }else if(pageElement.textSetting.horizentalAlign == 'center'){
            txtBox.style.justifyContent = 'center';
        }else if(pageElement.textSetting.horizentalAlign == 'right'){
            txtBox.style.justifyContent = 'end';
        }

        if (pageElement.fitContent.fitHeight) {
            txtBox.style.height = txtRect.height + 'px';
            if (textSetting.verticalAlign == 'top') {
                txtBox.style.top = '0';
            } else if (textSetting.verticalAlign == 'center') {
                txtBox.style.top = (domRect.height - txtRect.height) / 2 + 'px';
            } else if (textSetting.verticalAlign == 'bottom') {
                txtBox.style.bottom = '0';
            }
        } else {
            txtBox.style.height = dom.style.height;
            txtBox.style.top = '0';
            txtBox.style.alignItems = 'start';
        }
        if (textSetting.verticalAlign == 'top') {
            txtBox.style.alignItems = 'start';
        } else if (textSetting.verticalAlign == 'center') {
            txtBox.style.alignItems = 'center';
        } else if (textSetting.verticalAlign == 'bottom') {
            txtBox.style.alignItems = 'end';
        }
        let ret:any = dom;
        ret.objectBoundingRect = domRect;
        ret.measuredBoundingRect = txtRect;
        ret.sourceObject = pageElement;
        dom.remove();
        return ret;
    }

    cutText(elem: HTMLElement, width: number, height: number): boolean {
        var satisfied = () => elem.getBoundingClientRect().height <= height && elem.getBoundingClientRect().width <= width;

        var content = elem.innerText;
        if (content.length == 0)
            return satisfied();

        var start = 0, end = content.length;
        while (start != end) {
            var mid = Math.ceil((start + end) / 2);
            elem.innerText = content.substring(0, end);
            if (satisfied()) {
                start = end;
                return true;
            } else {
                elem.innerText = content.substring(0, mid)
                if (satisfied()) {
                    //可以从右边继续添加文本
                    start = mid;
                } else {
                    //只能从左边剪裁文本
                    end = mid - 1;
                }
            }
        }
        if (end == 0) {
            return satisfied();
        }
        elem.innerText = content.substring(0, end);
        return true;
    }
}