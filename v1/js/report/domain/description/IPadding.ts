import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface IPadding extends ICloneable<IPadding>,ISimpleObject{
    left: number;
    leftUnit?:string;
    right:number;
    rightUnit?:string;
    top:number;
    topUnit?:string;
    bottom:number;
    bottomUnit?:string;
}