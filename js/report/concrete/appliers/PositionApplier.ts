import { IPosition } from "../../domain/description/IPosition.js";
import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier.js";

export class PositionApplier implements IApplier<HTMLElement,IPosition>{
    apply(target: HTMLElement, value: IPosition, defaultValue: IPosition): void {
        value = new DefaultValueCalculator<IPosition>().calc(value,defaultValue); 
        
        target.style.left = `${value.x}${value.xUnit}`;
        target.style.top = `${value.y}${value.yUnit}`;
        target.style.position = 'absolute';
    }
    
}