import { IBorder } from "../../domain/description/IBorder.js";
import { DefaultValueCalculator } from "../defaultvalue/DefaultValueCalculator.js";
import { IApplier } from "./IApplier.js";

export class BorderApplier implements IApplier<HTMLElement,IBorder>{
    apply(target: HTMLElement, value: IBorder, defaultValue: IBorder): void {
        value = new DefaultValueCalculator<IBorder>().calc(value,defaultValue); 

        target.style.borderLeftColor = value.leftColor;
        target.style.borderLeftStyle = value.leftStyle;
        target.style.borderLeftWidth = `${value.leftWidth}${value.leftWidthUnit}`;
        
        target.style.borderRightColor = value.rightColor;
        target.style.borderRightStyle = value.rightStyle;
        target.style.borderRightWidth = `${value.rightWidth}${value.rightWidthUnit}`;

        target.style.borderTopColor = value.topColor;
        target.style.borderTopStyle = value.topStyle;
        target.style.borderTopWidth = `${value.topWidth}${value.topWidthUnit}`;

        target.style.borderBottomColor = value.bottomColor;
        target.style.borderBottomStyle = value.bottomStyle;
        target.style.borderBottomWidth = `${value.bottomWidth}${value.bottomWidthUnit}`;

        target.style.borderTopLeftRadius = `${value.borderTopLeftRadiusWidth}${value.borderTopLeftRadiusWidthUnit}`;
        target.style.borderTopRightRadius = `${value.borderTopRightRadiusWidth}${value.borderTopRightRadiusWidthUnit}`;
        target.style.borderBottomLeftRadius = `${value.borderBottomLeftRadiusWidth}${value.borderBottomLeftRadiusWidthUnit}`;
        target.style.borderBottomRightRadius = `${value.borderBottomRightRadiusWidth}${value.borderBottomRightRadiusWidthUnit}`;

    }

}