import { IFitContent } from "../../domain/description/IFitContent.js";
import { ICloneable } from "../../domain/experence/ICloneable";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable";

export class FitContent implements IFitContent,ICloneable<FitContent>
,IOptionalInitializable<FitContent>,IOptionalInitializable<IFitContent>{
    constructor(initialValue?:Partial<IFitContent>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): IFitContent & FitContent {
        return new FitContent(this);
    }

    fitWidth: boolean;
    fitHeight: boolean;

    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}