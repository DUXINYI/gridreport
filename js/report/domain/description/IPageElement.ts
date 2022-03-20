import { IBorder } from "./IBorder.js";
import { ICloneable } from "../experence/ICloneable.js";
import { IFont } from "./IFont.js";
import { IPadding } from "./IPadding.js";
import { IPosition } from "./IPosition.js";
import { ISize } from "./ISize.js";
import { ITextSetting } from "./ITextSetting.js";
import { IFitContent } from "./IFitContent.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface IPageElement extends ICloneable<IPageElement>,ISimpleObject{
    padding:IPadding;
    border:IBorder;
    position:IPosition;
    size:ISize;
    font:IFont;
    textSetting:ITextSetting;
    fitContent:IFitContent;
    content:string;
    backgroundColor:string;
}