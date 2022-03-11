import { ISize } from "../../domain/description/ISize.js";
import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier.js";

export class SizeApplier implements IApplier<HTMLElement,ISize>{
    apply(target: HTMLElement, value: ISize,defaultValue:ISize): void {
        value = new DefaultValueCalculator<ISize>().calc(value,defaultValue); 

        
        target.style.width = `${value.w}${value.wUnit}`;
        target.style.height =  `${value.h}${value.hUnit}`;
    }
}