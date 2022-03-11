import { ICloneable } from "../../domain/experence/ICloneable.js";
import { ISize } from "../../domain/description/ISize.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";

export class Size implements ISize,ICloneable<Size>
,IOptionalInitializable<Size>,IOptionalInitializable<ISize>{
    constructor(initialValue?:Partial<ISize>){
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): ISize & Size {
        return new Size(this);
    }
    private _w: number;
    public get w(): number {
        return this._w;
    }
    public set w(value: number) {
        this._w = value;
    }
    private _wUnit?: string;
    public get wUnit(): string {
        return this._wUnit;
    }
    public set wUnit(value: string) {
        this._wUnit = value;
    }
    private _h: number;
    public get h(): number {
        return this._h;
    }
    public set h(value: number) {
        this._h = value;
    }
    private _hUnit?: string;
    public get hUnit(): string {
        return this._hUnit;
    }
    public set hUnit(value: string) {
        this._hUnit = value;
    }
    
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}