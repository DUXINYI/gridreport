import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IFont } from "../../domain/description/IFont.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class Font implements IFont,ICloneable<Font>
,IOptionalInitializable<Font>,IOptionalInitializable<IFont>{
    constructor(initialValue?:Partial<IFont>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): IFont & Font {
        return new Font(this);
    }
    fontFamily: string;
    fontSize: number;
    fontSizeUnit?: string;
    isUnderline: boolean;
    isBold: boolean;
    isItalic: boolean;
    color:string;
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}