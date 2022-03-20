import { IPage } from "../../domain/description/IPage.js";
import { IBindingSource } from "../../domain/renderer/IBindingSource.js";
import { IFormatResolver } from "../../domain/renderer/IFormatResolver.js";
import { IMeasuredBoundingRect } from "../../domain/renderer/IMeasuredBoundingRect.js";
import { IPageElementRenderer } from "../../domain/renderer/IPageElementRenderer.js";
import { IPageRenderer } from "../../domain/renderer/IPageRenderer.js";
import { BackgroundColorApplier } from "../appliers/BackgroundColorApplier.js";
import { SizeApplier } from "../appliers/SizeApplier.js";
import { Size } from "../description/Size.js";
import { PageElementRenderer } from "./PageElementRenderer.js";

export class PageRenderer implements IPageRenderer<HTMLElement>{
    defaultUnit:string;
    formatResolver: IFormatResolver;
    elementRenderer: IPageElementRenderer<HTMLElement>;

    constructor(defaultUnit:string = 'mm',formatResolver:IFormatResolver=null){
        this.defaultUnit = defaultUnit;
        this.formatResolver = formatResolver;
        this.elementRenderer = new PageElementRenderer(defaultUnit,formatResolver);
    }

    render(page: IPage): HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect {
        let root = this.renderRoot(page);
        document.body.appendChild(root);
        let rootRect = root.getBoundingClientRect();

        let elemIdx = 0;
        for(let elem of page.elements){
            let elemRenderer = <PageElementRenderer>this.elementRenderer;
            let elemDom = elemRenderer.render(elem,root);
            elemDom.dataset.elementIndex = elemIdx++ + '';
            root.appendChild(elemDom);
        }

        root.remove();

        let rootAny = <any>root;
        rootAny.sourceObject = page;
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
            wUnit:this.defaultUnit,
            hUnit:this.defaultUnit
        }));
        new BackgroundColorApplier().apply(root,page.backgroundColor,null);
        
        return root;
    }
}