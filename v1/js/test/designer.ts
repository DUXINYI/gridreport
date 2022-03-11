
import { PageDesigner } from "../designer/concrete/PageDesigner.js";
import { Page } from "../report/concrete/description/Page.js";
import { PageElement } from "../report/concrete/description/PageElement.js";
import { Size } from "../report/concrete/description/Size.js";

var designerDom = <HTMLElement>document.querySelector('.designer-dom');
var popupDom = <HTMLElement>document.querySelector('.popup-dom');
var toolbarDom = <HTMLElement>document.querySelector('.toolbar-dom');

let windowAny = <any>window;

let page = new PageDesigner();
page.designerDom = designerDom;
page.popupDom = popupDom;
page.toolbarDom = toolbarDom;

windowAny.page = page;

page.open(new Page({
    size:new Size({
        w:300,
        h:100
    }),
    elements:[]
}));

windowAny.addElement = ()=> page.addPageElement();
windowAny.removeElement = ()=>page.removePageElements(page.selectedTarget);