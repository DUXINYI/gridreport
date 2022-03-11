export interface OnChangeHandler<T>{
    (value:T):void;
}
export interface IHtmlDrawer<T>{
    displayName:string;
    draw(host:HTMLElement,value:T,changeHandler:OnChangeHandler<T>):void;
}