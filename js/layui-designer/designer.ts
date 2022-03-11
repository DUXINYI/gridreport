
import { PageDesigner } from "../designer/concrete/PageDesigner.js";
import { Page } from "../report/concrete/description/Page.js";
import { Size } from "../report/concrete/description/Size.js";
import { PageUi } from "./PageUi.js";


var designerDom = <HTMLElement>document.querySelector('.designer-dom');
var popupDom = <HTMLElement>document.querySelector('.popup-dom');
var toolbarDom = <HTMLElement>document.querySelector('.toolbar-dom');

const windowAny = <any>window;

let designer = new PageDesigner();
designer.pageUi = new PageUi(designer);
designer.popupDom = popupDom;
designer.toolbarDom = toolbarDom;
designer.designerDom = designerDom;


windowAny.designer = designer;

designer.open(new Page({
    size:new Size({
        w:210,
        h:297,
        wUnit:'mm',
        hUnit:'mm'
    }),
    elements:[]
}));


