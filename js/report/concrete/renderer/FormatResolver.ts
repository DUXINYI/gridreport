import { DataBindingHandler } from "./DataBindingHandler.js";
import { IFormatResolver } from "../../domain/renderer/IFormatResolver.js";

export class FormatResolver implements IFormatResolver{
    bindingHandler:DataBindingHandler;
    constructor(bindingHandler:DataBindingHandler=null){
        this.bindingHandler = bindingHandler;
    }

    parseKeys(format:string):string[]{
        return /\[#(\w+)#\]/.exec(format).map(t=>t[1]);
    }

    parseContent(format: string): string {
        if(this.bindingHandler == null){
            return format;
        }
        return format.replace(/\[#(\w+)#\]/g,sub=>this.bindingHandler(sub.substring(2,sub.length-2) || sub));
    }
    
}