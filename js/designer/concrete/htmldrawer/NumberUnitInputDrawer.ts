import { IHtmlDrawer, OnChangeHandler } from "../../domain/htmldrawer/IHtmlDrawer.js";

export interface INumberUnit{
    value:number;
    valueUnit:string;
}

export class NumberUnitInputDrawer implements IHtmlDrawer<INumberUnit>{
    displayName: string;
    unitCollection:string[];
    defaultUnit:string;

    constructor(displayName:string,unitCollection:string[],defaultUnit:string){
        this.displayName = displayName;
        this.unitCollection = unitCollection ?? [''];
        this.defaultUnit = defaultUnit ?? this.unitCollection[0];
    }

    draw(host: HTMLElement, value: INumberUnit, changeHandler: OnChangeHandler<INumberUnit>): void {
        const label = document.createElement('label');
        label.htmlFor = 'input_' + this.displayName;
        label.innerText = this.displayName;
        host.appendChild(label);

        const input = document.createElement('input');
        input.id = 'input_'+this.displayName+'_value';
        input.type = 'number';
        input.value = value.value?.toString();
        host.appendChild(input);

        const select = document.createElement('select');
        select.innerHTML = this.unitCollection.map(unit=>`<option>${unit}</option>`).join('');
        select.value = value.valueUnit ?? this.defaultUnit;
        host.appendChild(select);

        const evtHandler = (e:any)=>changeHandler && changeHandler({value:Number.parseFloat(input.value),valueUnit:select.value});
        input.onchange = evtHandler;
        select.onchange = evtHandler;
    }

}