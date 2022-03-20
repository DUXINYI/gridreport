import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface IPosition extends ICloneable<IPosition>,ISimpleObject{
    x:number;
    xUnit?:string;
    y:number;
    yUnit?:string;
}