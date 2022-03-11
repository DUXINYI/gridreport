
import { PageDesigner } from "../designer/concrete/PageDesigner.js";
import { Page } from "../report/concrete/description/Page.js";
import { Size } from "../report/concrete/description/Size.js";
import { ElementTypes } from "../report/domain/description/elements/IPageElement.js";

var designerDom = <HTMLElement>document.querySelector('.designer-dom');
var popupDom = <HTMLElement>document.querySelector('.popup-dom');
var toolbarDom = <HTMLElement>document.querySelector('.toolbar-dom');

let windowAny = <any>window;

let designer = new PageDesigner();
designer.designerDom = designerDom;
designer.popupDom = popupDom;
designer.toolbarDom = toolbarDom;
designer.pageRenderer.options.qrcodeRequestUrl = 'https://pic1.zhimg.com/v2-d45cad87d837c99bf7866c2ab4fe13a3_l.jpg?source=32738c0c&';

windowAny.page = designer;

designer.open(new Page({
    size:new Size({
        w:300,
        h:100
    }),
    elements:[]
}));

windowAny.addElement = (elementType:ElementTypes)=> designer.addPageElement(elementType);
windowAny.removeElement = ()=>designer.removePageElements(designer.selectedTarget);