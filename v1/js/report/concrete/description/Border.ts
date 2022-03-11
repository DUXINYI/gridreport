import { IBorder } from "../../domain/description/IBorder.js";
import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class Border implements IBorder,ICloneable<Border>
,IOptionalInitializable<Border>,IOptionalInitializable<IBorder>{
    constructor(initialValue?:Partial<IBorder>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): IBorder & Border {
        return new Border(this);
    }
    borderTopLeftRadiusWidth: number;
    borderTopLeftRadiusWidthUnit?: string;
    borderTopRightRadiusWidth: number;
    borderTopRightRadiusWidthUnit?: string;
    borderBottomLeftRadiusWidth: number;
    borderBottomLeftRadiusWidthUnit?: string;
    borderBottomRightRadiusWidth: number;
    borderBottomRightRadiusWidthUnit?: string;
    leftWidth: number;
    leftWidthUnit?: string;
    leftStyle: string;
    leftColor: string;
    rightWidth: number;
    rightWidthUnit?: string;
    rightStyle: string;
    rightColor: string;
    topWidth: number;
    topWidthUnit?: string;
    topStyle: string;
    topColor: string;
    bottomWidth: number;
    bottomWidthUnit?: string;
    bottomStyle: string;
    bottomColor: string;

    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}