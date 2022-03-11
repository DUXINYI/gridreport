import { IPage } from "../../report/domain/description/IPage";
import { IPageElement } from "../../report/domain/description/IPageElement";
import { IBindingSource } from "../../report/domain/renderer/IBindingSource";
import { IMeasuredBoundingRect } from "../../report/domain/renderer/IMeasuredBoundingRect";
import { IPageRenderer } from "../../report/domain/renderer/IPageRenderer.js";
import { IPageDesigner } from "./IPageDesigner";

export interface IPageDesignRenderer extends IPageRenderer<HTMLElement>{
    popupDom:HTMLElement;
    toolbarDom:HTMLElement;
    designerDom:HTMLElement;
    
    designer:IPageDesigner;
    render(page:IPage,selectedTargets?:IPageElement[]):HTMLElement & IBindingSource<IPage> & IMeasuredBoundingRect;
}