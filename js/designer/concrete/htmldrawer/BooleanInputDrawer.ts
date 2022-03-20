import { IHtmlDrawer, OnChangeHandler } from "../../domain/htmldrawer/IHtmlDrawer.js";

export class BooleanInputDrawer implements IHtmlDrawer<boolean>{
    displayName: string;
    constructor(displayName:string){
        this.displayName = displayName;
    }
    draw(host: HTMLElement, value: boolean, changeHandler: OnChangeHandler<boolean>): void {
        const input = document.createElement('input');
        input.id = 'input_'+this.displayName;
        input.type = 'checkbox';
        input.checked = value;
        const evtHandler = (e:any)=>changeHandler && changeHandler(input.checked);
        input.onchange = evtHandler;
        host.appendChild(input);

        const label = document.createElement('label');
        label.htmlFor = 'input_' + this.displayName;
        label.innerText = this.displayName;
        host.appendChild(label);
    }
}