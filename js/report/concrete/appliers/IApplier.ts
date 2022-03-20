export interface IApplier<TTarget,TValue>{
    apply(target:TTarget,value:TValue,defaultValue:TValue):void;
}