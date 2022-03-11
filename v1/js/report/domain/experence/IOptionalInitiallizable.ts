/*
    本接口是占位接口，代表该类型实现了可以使用部分属性值来直接初始化对象

    等价于new(initialValue?:Partial<T>):Required<T>;
    
    typescript不对构造函数进行返回值类型推断，故使用占位方式表示本类实现了对应的构造函数接口
*/
export interface IOptionalInitializable<T>{
    /*

    new(initialValue?:Partial<T>):T;

    */
}