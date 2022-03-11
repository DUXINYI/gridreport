import { IColor } from "../../domain/description/IColor.js";
import { ICloneable } from "../../domain/experence/ICloneable";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable";

export class Color implements IColor,ICloneable<Color>
,IOptionalInitializable<Color>,IOptionalInitializable<Color>{
    color: string;
    backgroundColor: string;
    constructor(initialValue?:Partial<IColor>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): IColor & Color {
        return new Color(this);
    }
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}