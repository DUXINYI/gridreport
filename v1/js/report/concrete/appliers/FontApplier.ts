import { IFont } from "../../domain/description/IFont.js";
import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier.js";

export class FontApplier implements IApplier<HTMLElement,IFont>{
    apply(target: HTMLElement, value: IFont, defaultValue: IFont): void {
        value = new DefaultValueCalculator<IFont>().calc(value,defaultValue); 
        
        target.style.fontFamily = value.fontFamily;
        target.style.fontSize = `${value.fontSize}${value.fontSizeUnit}`;
        target.style.color = value.color;
        target.style.fontWeight = value.isBold ? '900' : '400';
        target.style.textDecoration = value.isUnderline ? 'underline' : 'none';
        target.style.fontStyle = value.isItalic ? 'italic' : 'normal';
    }

}