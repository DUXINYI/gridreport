import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier";

export class BackgroundColorApplier implements IApplier<HTMLElement,string>{
    apply(target: HTMLElement, value: string, defaultValue: string): void {
        value = new DefaultValueCalculator<string>().calc(value,defaultValue); 
        
        target.style.backgroundColor = value;
    }

}