import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IPage } from "../../domain/description/IPage.js";
import { IPageElement } from "../../domain/description/elements/IPageElement.js";
import { ISize } from "../../domain/description/ISize.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";
import { Size } from "./Size.js";
import { ElementParser } from "./elements/ElementParser.js";

export class Page implements IPage,ICloneable<Page>
,IOptionalInitializable<Page>,IOptionalInitializable<IPage>{
    constructor(initialValue?:Partial<IPage>){
        debugger
        if(initialValue?.elements == null){
            this.elements = [];
        }else if(initialValue.elements instanceof Array){
            const elementParser = new ElementParser();
            this.elements = initialValue.elements.map(t=>elementParser.parse(t));
        }else{
            this.elements = [];
        }
        this.size = new Size(initialValue?.size);
        this.backgroundColor = initialValue?.backgroundColor||'';
    }
    clone(): IPage & Page {
        return new Page({
            size:this.size.clone(),
            backgroundColor:this.backgroundColor,
            elements:this.elements.map(e=>e.clone())
        });
    }
    
    private _size: ISize;
    public get size(): ISize {
        return this._size;
    }
    public set size(value: ISize) {
        this._size = value;
    }
    backgroundColor: string;
    private _elements: IPageElement[];
    public get elements(): IPageElement[] {
        return this._elements;
    }
    public set elements(value: IPageElement[]) {
        this._elements = value;
    }

    toSimpleObject():object{
        return {
            elements:this.elements.map(t=>t.toSimpleObject()),
            size:this.size.toSimpleObject(),
            backgroundColor:this.backgroundColor
        };
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}