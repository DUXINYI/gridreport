import { ICloneable } from "../../domain/experence/ICloneable.js";
import { ITextSetting } from "../../domain/description/ITextSetting.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class TextSetting implements ITextSetting,ICloneable<TextSetting>
,IOptionalInitializable<TextSetting>,IOptionalInitializable<ITextSetting>{
    constructor(initialValue?:Partial<ITextSetting>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): ITextSetting & TextSetting {
        return new TextSetting(this);
    }
    horizentalAlign: string;
    verticalAlign:string;
    isWrapping: boolean;

    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}