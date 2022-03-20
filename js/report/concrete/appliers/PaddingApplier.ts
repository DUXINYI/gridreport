import { IPadding } from "../../domain/description/IPadding.js";
import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier.js";

export class PaddingApplier implements IApplier<HTMLElement,IPadding>{
    apply(target: HTMLElement, value: IPadding, defaultValue:IPadding): void {
        value = new DefaultValueCalculator<IPadding>().calc(value,defaultValue); 

        target.style.paddingLeft = `${value.left}${value.leftUnit}`;
        target.style.paddingRight = `${value.right}${value.rightUnit}`;
        target.style.paddingTop = `${value.top}${value.topUnit}`;
        target.style.paddingBottom = `${value.bottom}${value.bottomUnit}`;
    }

}