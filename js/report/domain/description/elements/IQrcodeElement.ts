import { ICloneable } from "../../experence/ICloneable.js";
import { IBorder } from "../IBorder.js";
import { IColor } from "../IColor.js";
import { IFitContent } from "../IFitContent.js";
import { IPadding } from "../IPadding.js";
import { IPosition } from "../IPosition.js";
import { ISize } from "../ISize.js";
import { ISizeSquare } from "../ISizeSquare.js";
import { IPageElement } from "./IPageElement.js";

export interface IQrcodeElement extends IPageElement,ICloneable<IQrcodeElement>{
    elementType:'qrcode';
    position:IPosition;
    size:ISizeSquare;
    content:string;
    color:IColor;
}