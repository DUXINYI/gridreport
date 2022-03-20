import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface IBorder extends ICloneable<IBorder>,ISimpleObject{
    leftWidth:number;
    leftWidthUnit?:string;
    leftStyle:string;
    leftColor:string;
    rightWidth:number;
    rightWidthUnit?:string;
    rightStyle:string;
    rightColor:string;
    topWidth:number;
    topWidthUnit?:string;
    topStyle:string;
    topColor:string;
    bottomWidth:number;
    bottomWidthUnit?:string;
    bottomStyle:string;
    bottomColor:string;
    borderTopLeftRadiusWidth:number;
    borderTopLeftRadiusWidthUnit?:string;
    borderTopRightRadiusWidth:number;
    borderTopRightRadiusWidthUnit?:string;
    borderBottomLeftRadiusWidth:number;
    borderBottomLeftRadiusWidthUnit?:string;
    borderBottomRightRadiusWidth:number;
    borderBottomRightRadiusWidthUnit?:string;
}