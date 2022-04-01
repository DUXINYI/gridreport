import { IPageElement } from "../../../domain/description/elements/IPageElement.js";
import { ITextElement } from "../../../domain/description/elements/ITextElement.js";
import { IBorder } from "../../../domain/description/IBorder.js";
import { IColor } from "../../../domain/description/IColor.js";
import { IFitContent } from "../../../domain/description/IFitContent.js";
import { IFont } from "../../../domain/description/IFont.js";
import { IPadding } from "../../../domain/description/IPadding.js";
import { IPosition } from "../../../domain/description/IPosition.js";
import { ISize } from "../../../domain/description/ISize.js";
import { ITextSetting } from "../../../domain/description/ITextSetting.js";
import { ICloneable } from "../../../domain/experence/ICloneable.js";
import { IOptionalInitializable } from "../../../domain/experence/IOptionalInitiallizable.js";
import { Border } from "../Border.js";
import { Color } from "../Color.js";
import { FitContent } from "../FitContent.js";
import { Font } from "../Font.js";
import { Padding } from "../Padding.js";
import { Position } from "../Position.js";
import { Size } from "../Size.js";
import { TextSetting } from "../TextSetting.js";

export class TextElement implements ITextElement, ICloneable<TextElement>
    , IOptionalInitializable<TextElement>, IOptionalInitializable<IPageElement>{
    elementType: 'text' = 'text';
    padding: IPadding;
    border: IBorder;
    position: IPosition;
    size: ISize;
    fitContent: IFitContent;
    font: IFont;
    textSetting: ITextSetting;
    content: string;
    color: IColor;

    constructor(initialValue?: Partial<ITextElement>) {
        this.padding = new Padding(initialValue?.padding);
        this.border = new Border(initialValue?.border);
        this.position = new Position(initialValue?.position);
        this.size = new Size(initialValue?.size);
        this.font = new Font(initialValue?.font);
        this.textSetting = new TextSetting(initialValue?.textSetting);
        this.content = initialValue?.content || '';
        this.fitContent = new FitContent(initialValue?.fitContent);
        this.color = new Color(initialValue?.color);
    }

    clone(): ITextElement & TextElement {
        return new TextElement({
            padding: this.padding.clone(),
            border: this.border.clone(),
            position: this.position.clone(),
            size: this.size.clone(),
            font: this.font.clone(),
            textSetting: this.textSetting.clone(),
            fitContent: this.fitContent.clone(),
            color: this.color.clone(),
            content: this.content,
        })
    }
    toSimpleObject(): object {
        return {
            elementType: this.elementType,
            border: this.border.toSimpleObject(),
            position: this.position.toSimpleObject(),
            padding: this.padding.toSimpleObject(),
            size: this.size.toSimpleObject(),
            font: this.font.toSimpleObject(),
            textSetting: this.textSetting.toSimpleObject(),
            fitContent: this.fitContent.toSimpleObject(),
            color: this.color.toSimpleObject(),
            content: this.content,
        };
    }
    toString(): string {
        return JSON.stringify(this.toSimpleObject());
    }
}