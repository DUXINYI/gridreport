import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface ISize extends ICloneable<ISize>,ISimpleObject{
    w:number;
    wUnit?:string;
    h:number;
    hUnit?:string;
}