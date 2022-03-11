import { ICloneable } from "../../domain/experence/ICloneable.js";
import { ISize } from "../../domain/description/ISize.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class Size implements ISize,ICloneable<Size>
,IOptionalInitializable<Size>,IOptionalInitializable<ISize>{
    constructor(initialValue?:Partial<ISize>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): ISize & Size {
        return new Size(this);
    }
    w: number;
    wUnit?: string;
    h: number;
    hUnit?: string;
    
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}