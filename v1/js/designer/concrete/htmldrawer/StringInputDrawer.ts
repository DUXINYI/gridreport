import { IHtmlDrawer, OnChangeHandler } from "../../domain/htmldrawer/IHtmlDrawer.js";

export class StringInputDrawer implements IHtmlDrawer<string>{
    displayName: string;
    textarea:boolean;
    constructor(displayName:string,textarea:boolean = false){
        this.displayName = displayName;
        this.textarea = textarea;
    }
    draw(host: HTMLElement, value: string, changeHandler: OnChangeHandler<string>): void {
        const label = document.createElement('label');
        label.innerText = this.displayName;
        host.appendChild(label);

        const input = this.textarea ? document.createElement('textarea') : document.createElement('input');
        if(this.textarea)
            host.style.display = 'flex';
        input.value = value;
        host.appendChild(input);
        const evtHandler = (e:Event)=>changeHandler(input.value);
        input.onchange = evtHandler;
    }

}