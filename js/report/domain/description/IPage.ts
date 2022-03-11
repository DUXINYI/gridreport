import { ICloneable } from "../experence/ICloneable.js";
import { ISimpleObject } from "../experence/ISimpleObject.js";
import { IPageElement } from "./elements/IPageElement.js";
import { ISize } from "./ISize.js";

export interface IPage extends ICloneable<IPage>,ISimpleObject{
    size:ISize;
    backgroundColor:string;
    elements:IPageElement[];
}