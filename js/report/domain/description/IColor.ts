import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";

export interface IColor extends ICloneable<IColor>, ISimpleObject{
    color:string;
    backgroundColor:string;
}