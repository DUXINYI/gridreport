import { ILineElement } from "../../../domain/description/elements/ILineElement.js";
import { IPageElement } from "../../../domain/description/elements/IPageElement.js";
import { IColor } from "../../../domain/description/IColor.js";
import { IPosition } from "../../../domain/description/IPosition.js";
import { ICloneable } from "../../../domain/experence/ICloneable.js";
import { IOptionalInitializable } from "../../../domain/experence/IOptionalInitiallizable.js";
import { Color } from "../Color.js";
import { Position } from "../Position.js";

export class LineElement implements ILineElement,ICloneable<LineElement>
,IOptionalInitializable<LineElement>,IOptionalInitializable<ILineElement>{
    elementType: 'line' = 'line';
    point1: IPosition;
    point2: IPosition;
    color: string;
    lineStyle: 'solid'|'dashed'|'dotted';
    lineWidth: number;
    lineWidthUnit?: string;
    constructor(initialValue?:Partial<ILineElement>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
        if(this.point1 == null)
            this.point1 = new Position(initialValue?.point1);
        if(this.point2 == null)
            this.point2 = new Position(initialValue?.point2);
    }
    clone(): ILineElement & LineElement {
        return new LineElement({
            point1:this.point1.clone(),
            point2:this.point2.clone(),
            color:this.color,
            lineStyle:this.lineStyle,
            lineWidth:this.lineWidth,
            lineWidthUnit:this.lineWidthUnit
        })
    }
    toSimpleObject(): object {
        return {
            elementType:this.elementType,
            point1: this.point1.toSimpleObject(),
            point2:  this.point2.toSimpleObject(),
            color:this.color,
            lineStyle:this.lineStyle,
            lineWidth:this.lineWidth,
            lineWidthUnit:this.lineWidthUnit
        };
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}