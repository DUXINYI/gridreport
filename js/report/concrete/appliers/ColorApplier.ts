import { IColor } from "../../domain/description/IColor.js";
import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier.js";

export class ColorApplier implements IApplier<HTMLElement,IColor>{
    apply(target: HTMLElement, value: IColor, defaultValue: IColor): void {
        value = new DefaultValueCalculator<IColor>().calc(value,defaultValue); 
        
        target.style.color = value.color;
        target.style.backgroundColor = value.backgroundColor;
    }
    
}