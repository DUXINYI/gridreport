import { ICloneable } from "../../domain/experence/ICloneable.js";

export class DefaultValueCalculator<T extends string|number|boolean|Array<any>|ICloneable<T>>{
    calc(value:T,defaultValue:T):T{
        if(defaultValue == null){
            return value;
        }
        if(typeof(value) == 'string'){
            return <T><unknown>(value ?? defaultValue);
        }
        if(typeof(value) == 'number'){
            return <T><unknown>(value == null ? defaultValue : value);
        }
        if(typeof(value) == 'boolean'){
            return <T><unknown>(value == null ? defaultValue : value);
        }
        if(value instanceof Array){
            return <T><unknown>Array.from(<Array<any>><unknown>( value == null ? defaultValue : value));
        }
        if(value && value.clone){
            return Object.assign((<ICloneable<T>>value).clone(),defaultValue,value);
        }
        if((<any>defaultValue).clone){
            return Object.assign((<ICloneable<T>>defaultValue).clone(),value);
        }
        return Object.assign(defaultValue,value);
    }
}