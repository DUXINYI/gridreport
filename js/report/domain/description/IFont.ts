import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface IFont extends ICloneable<IFont>,ISimpleObject{
    fontFamily:string;
    fontSize:number;
    fontSizeUnit?:string;
    isUnderline:boolean;
    isBold:boolean;
    isItalic:boolean;
}