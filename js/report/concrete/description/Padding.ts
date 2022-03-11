import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IPadding } from "../../domain/description/IPadding.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class Padding implements IPadding, ICloneable<Padding>
,IOptionalInitializable<Padding>,IOptionalInitializable<IPadding>{
    constructor(initialValue?:Partial<IPadding>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): IPadding & Padding {
        return new Padding(this);
    }
    left: number;
    leftUnit?: string;
    right: number;
    rightUnit?: string;
    top: number;
    topUnit?: string;
    bottom: number;
    bottomUnit?: string;
    
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}