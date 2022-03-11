import { IBorder } from "../IBorder.js";
import { ICloneable } from "../../experence/ICloneable.js";
import { IFont } from "../IFont.js";
import { IPadding } from "../IPadding.js";
import { IPosition } from "../IPosition.js";
import { ISize } from "../ISize.js";
import { ITextSetting } from "../ITextSetting.js";
import { IFitContent } from "../IFitContent.js";
import { ISimpleObject } from "../../experence/ISimpleObject.js";
import { IColor } from "../IColor.js";

export type ElementTypes = 'text'|'qrcode'|'line';

export interface IPageElement extends ICloneable<IPageElement>,ISimpleObject{
    elementType:ElementTypes;

}