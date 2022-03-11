import { ISize } from "../../domain/description/ISize.js";
import { ISizeSquare } from "../../domain/description/ISizeSquare.js";
import { ICloneable } from "../../domain/experence/ICloneable.js";
import { IOptionalInitializable } from "../../domain/experence/IOptionalInitiallizable.js";
import { Size } from "./Size.js";

export class SizeSquare extends Size implements ISizeSquare,ICloneable<SizeSquare>
,IOptionalInitializable<SizeSquare>,IOptionalInitializable<ISizeSquare>{
    private _l: number;
    get l():number{
        return this._l;
    }
    set l(value:number){
        this._l = super.w = super.h = value;
    }

    private _lUnit?: string;
    get lUnit():string{
        return this._lUnit;
    }
    set lUnit(value:string){
        this._lUnit = super.wUnit = super.hUnit = value;
    }
    
    get w():number{
        return this._l;
    }
    set w(value:number){
        this._l = value;
    }
    get h():number{
        return this._l;
    }
    set h(value:number){
        this.l = value;
    }

    get wUnit():string{
        return this._lUnit;
    }
    set wUnit(value:string){
        this.lUnit = value;
    }
    get hUnit():string{
        return this._lUnit;
    }
    set hUnit(value:string){
        this.lUnit = value;
    }

    constructor(initialValue?:Partial<ISizeSquare>){
        super(initialValue);
        if(initialValue != null){
            Object.assign(this,initialValue);
        }
    }
    clone(): ISizeSquare & SizeSquare {
        return new SizeSquare(this);
    }
    
    toSimpleObject():object{
        return this;
    }
    toString():string{
        return JSON.stringify(this.toSimpleObject());
    }
}