
import { PageDesigner } from "../designer/concrete/PageDesigner.js";
import { Page } from "../report/concrete/description/Page.js";
import { PageElement } from "../report/concrete/description/PageElement.js";
import { Size } from "../report/concrete/description/Size.js";
import { PageDesignRenderer } from "./PageDesignRenderer.js";

var designerDom = <HTMLElement>document.querySelector('.designer-dom');
var popupDom = <HTMLElement>document.querySelector('.popup-dom');
var toolbarDom = <HTMLElement>document.querySelector('.toolbar-dom');

const windowAny = <any>window;

let designer = new PageDesigner();
designer.designerDom = designerDom;
designer.popupDom = popupDom;
designer.toolbarDom = toolbarDom;
designer.renderer = new PageDesignRenderer();

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


