import { ICloneable } from "../experence/ICloneable.js";
import { ISize } from "./ISize.js";

export interface ISizeSquare extends ISize,ICloneable<ISizeSquare>{
    l:number;
    lUnit?:string;
}