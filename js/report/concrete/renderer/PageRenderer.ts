import { IPage } from "../../domain/description/IPage.js";
import { IBindingSource } from "../../domain/renderer/IBindingSource.js";
import { IFormatResolver } from "../../domain/renderer/formatresolver/IFormatResolver.js";
import { IMeasuredBoundingRect } from "../../domain/renderer/IMeasuredBoundingRect.js";
import { IPageElementRenderer } from "../../domain/renderer/elementrenderer/IPageElementRenderer.js";
import { IPageRenderer, IPageRendererOptions } from "../../domain/renderer/IPageRenderer.js";
import { BackgroundColorApplier } from "../appliers/BackgroundColorApplier.js";
import { SizeApplier } from "../appliers/SizeApplier.js";
import { Size } from "../description/Size.js";
import { IPageElementRendererParser } from "../../domain/renderer/elementrenderer/IPageElementRendererParser.js";
import { PageElementRendererParser } from "./elementrenderer/PageElementRendererParser.js";
import { IObjectBoundingRect } from "../../domain/renderer/IObjectBoundingRect.js";
export class PageRenderer implements IPageRenderer<HTMLElement>{
    options:Partial<IPageRendererOptions>;

    constructor(options:Partial<IPageRendererOptions>){
        this.options = options;
        if(this.options == null){
            this.options = {};
        }
        if(this.options.defaultLengthUnit == null){
            this.options.defaultLengthUnit = 'mm';
        }
        if(this.options.elementRendererParser == null)
            this.options.elementRendererParser = new PageElementRendererParser();
    }

    render(page: IPage): HTMLElement & IBindingSource<IPage> & IObjectBoundingRect & IMeasuredBoundingRect {
        let root = this.renderRoot(page);
        document.body.appendChild(root);
        let rootRect = root.getBoundingClientRect();

        let elemIdx = 0;
        for(let elem of page.elements){
            let elemRenderer = this.options.elementRendererParser.parse(elem,this.options);
            let elemDom = elemRenderer.render(elem,root);
            elemDom.dataset.elementIndex = elemIdx++ + '';
            root.appendChild(elemDom);
        }

        root.remove();

        let rootAny = <any>root;
        rootAny.sourceObject = page;
        rootAny.objectBoundingRect = rootRect;
        rootAny.measuredBoundingRect = rootRect;
        return rootAny;
    }
    
    renderRoot(page:IPage):HTMLElement{
        let root = document.createElement('div');
        root.style.position = 'relative';
        root.classList.add('page-box');
        new SizeApplier().apply(root,page.size,new Size({
            w:0,
            h:0,
            wUnit:this.options.defaultLengthUnit,
            hUnit:this.options.defaultLengthUnit
        }));
        new BackgroundColorApplier().apply(root,page.backgroundColor,null);
        
        return root;
    }
}