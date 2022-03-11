import { ICloneable } from "../../experence/ICloneable.js";
import { IPosition } from "../IPosition.js";
import { IPageElement } from "./IPageElement.js";

export interface ILineElement extends IPageElement,ICloneable<ILineElement>{
    elementType:'line';
    lineStyle:'solid'|'dashed'|'dotted';
    lineWidth:number;
    lineWidthUnit?:string;
    color:string;
    point1:IPosition;
    point2:IPosition;
}