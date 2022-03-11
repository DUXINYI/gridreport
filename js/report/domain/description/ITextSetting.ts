import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface ITextSetting extends ICloneable<ITextSetting>,ISimpleObject{
    horizentalAlign:string;
    verticalAlign:string;
    isWrapping:boolean;
}