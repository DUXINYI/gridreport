import { IHtmlDrawer, OnChangeHandler } from "../../domain/htmldrawer/IHtmlDrawer.js";

export interface ISelectOption{
    text:string,
    value:string
}

export class SelectInputDrawer implements IHtmlDrawer<string>{
    displayName: string;
    options:ISelectOption[];

    constructor(displayName:string,options:ISelectOption[]){
        this.displayName = displayName;
        this.options = options ?? [];
    }

    draw(host: HTMLElement, value: string, changeHandler: OnChangeHandler<string>): void {
        const label = document.createElement('label');
        label.htmlFor = 'input_' + this.displayName;
        label.innerText = this.displayName;
        host.appendChild(label);

        const select = document.createElement('select');
        select.innerHTML = this.options.map(option=>`<option value="${option.value}">${option.text}</option>`).join('');
        select.value = value ?? this.options[0].value;
        host.appendChild(select);

        const evtHandler = (e:any)=>changeHandler && changeHandler(select.value);
        select.onchange = evtHandler;
    }
    
}