import { IBorder } from "../../domain/description/IBorder.js";
import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IFont } from "../../domain/description/IFont.js";
import { IPadding } from "../../domain/description/IPadding.js";
import { IPageElement } from "../../domain/description/IPageElement.js";
import { IPosition } from "../../domain/description/IPosition.js";
import { ISize } from "../../domain/description/ISize.js";
import { ITextSetting } from "../../domain/description/ITextSetting.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";
import { Padding } from "./Padding.js";
import { Border } from "./Border.js";
import { Position } from "./Position.js";
import { Size } from "./Size.js";
import { Font } from "./Font.js";
import { TextSetting } from "./TextSetting.js";
import { IFitContent } from "../../domain/description/IFitContent.js";
import { FitContent } from "./FitContent.js";

export class PageElement implements IPageElement,ICloneable<PageElement>
,IOptionalInitializable<PageElement>,IOptionalInitializable<IPageElement>{
    padding: IPadding;
    border: IBorder;
    position: IPosition;
    size: ISize;
    font: IFont;
    textSetting: ITextSetting;
    fitContent: IFitContent;
    content: string;
    backgroundColor: string;
    
    constructor(initialValue?:Partial<IPageElement>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
        if(this.padding == null)
            this.padding = new Padding(initialValue?.padding);
        if(this.border == null)
            this.border = new Border(initialValue?.border);
        if(this.position == null)
            this.position = new Position(initialValue?.position);
        if(this.size == null)
            this.size = new Size(initialValue?.size);
        if(this.font == null)
            this.font = new Font(initialValue?.font);
        if(this.textSetting == null)
            this.textSetting = new TextSetting(initialValue?.textSetting);
        if(this.content == null)
            this.content = '';
        if(this.fitContent == null)
            this.fitContent = new FitContent(initialValue?.fitContent);
    }
    clone(): IPageElement & PageElement {
        return new PageElement({
            padding: this.padding.clone(),
            border:  this.border.clone(),
            position: this.position.clone(),
            size:  this.size.clone(),
            font:  this.font.clone(),
            textSetting:this.textSetting.clone(),
            fitContent:this.fitContent.clone(),
            content:this.content,
            backgroundColor:this.backgroundColor
        })
    }
    toSimpleObject():object{
        return {
            padding: this.padding.toSimpleObject(),
            border:  this.border.toSimpleObject(),
            position: this.position.toSimpleObject(),
            size:  this.size.toSimpleObject(),
            font:  this.font.toSimpleObject(),
            textSetting:this.textSetting.toSimpleObject(),
            fitContent:this.fitContent.toSimpleObject(),
            content:this.content,
            backgroundColor:this.backgroundColor
        };
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }

}