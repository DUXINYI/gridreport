import { ICloneable } from "../experence/ICloneable";
import { ISimpleObject } from "../experence/ISimpleObject";

export interface IFitContent extends ICloneable<IFitContent>,ISimpleObject{
    fitWidth:boolean;
    fitHeight:boolean;
}