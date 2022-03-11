import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IPosition } from "../../domain/description/IPosition.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class Position implements IPosition,ICloneable<Position>
,IOptionalInitializable<Position>,IOptionalInitializable<IPosition>{
    constructor(initialValue?:Partial<IPosition>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): IPosition & Position {
        return new Position(this);
    }
    x: number;
    xUnit?: string;
    y: number;
    yUnit?: string;
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}