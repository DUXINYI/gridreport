export class DefaultValueCalculator<T>{
    calc(value:T,defaultValue:T):T{
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
        return Object.assign({},defaultValue,value);
    }
}