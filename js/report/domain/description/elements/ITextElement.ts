import { ICloneable } from "../../experence/ICloneable.js";
import { IBorder } from "../IBorder.js";
import { IColor } from "../IColor.js";
import { IFitContent } from "../IFitContent.js";
import { IFont } from "../IFont.js";
import { IPadding } from "../IPadding.js";
import { IPosition } from "../IPosition.js";
import { ISize } from "../ISize.js";
import { ITextSetting } from "../ITextSetting.js";
import { IPageElement } from "./IPageElement.js";

export interface ITextElement extends IPageElement,ICloneable<ITextElement>{
    elementType:'text';
    padding:IPadding;
    border:IBorder;
    position:IPosition;
    size:ISize;
    fitContent:IFitContent;
    font:IFont;
    textSetting:ITextSetting;
    content:string;
    color:IColor;
}