import { IPageElement } from "../../../domain/description/elements/IPageElement.js";
import { IQrcodeElement } from "../../../domain/description/elements/IQrcodeElement.js";
import { IBorder } from "../../../domain/description/IBorder.js";
import { IColor } from "../../../domain/description/IColor.js";
import { IFitContent } from "../../../domain/description/IFitContent.js";
import { IPadding } from "../../../domain/description/IPadding.js";
import { IPosition } from "../../../domain/description/IPosition.js";
import { ISize } from "../../../domain/description/ISize.js";
import { ISizeSquare } from "../../../domain/description/ISizeSquare.js";
import { ICloneable } from "../../../domain/experence/ICloneable.js";
import { IOptionalInitializable } from "../../../domain/experence/IOptionalInitiallizable.js";
import { Border } from "../Border.js";
import { Color } from "../Color.js";
import { FitContent } from "../FitContent.js";
import { Padding } from "../Padding.js";
import { Position } from "../Position.js";
import { Size } from "../Size.js";
import { SizeSquare } from "../SizeSquare.js";

export class QrcodeElement implements IQrcodeElement,ICloneable<QrcodeElement>
,IOptionalInitializable<QrcodeElement>,IOptionalInitializable<IQrcodeElement>{
    elementType: 'qrcode' = 'qrcode';
    position: IPosition;
    size: ISizeSquare;
    content: string;
    color: IColor;

    constructor(initialValue?:Partial<IQrcodeElement>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
        if(this.position == null)
            this.position = new Position(initialValue?.position);
        if(this.size == null)
            this.size = new SizeSquare(initialValue?.size);
        if(this.content == null)
            this.content = '';
        if(this.color == null)
            this.color = new Color(initialValue?.color);
    }
    clone(): IQrcodeElement & QrcodeElement {
        return new QrcodeElement({
            position: this.position.clone(),
            size:  this.size.clone(),
            color:this.color.clone(),
            content:this.content,
        })
    }
    toSimpleObject(): object {
        return {
            elementType:this.elementType,
            position: this.position.toSimpleObject(),
            size:  this.size.toSimpleObject(),
            color:this.color.toSimpleObject(),
            content:this.content,
        };
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}