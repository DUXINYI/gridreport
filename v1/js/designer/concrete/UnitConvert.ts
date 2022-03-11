export class UnitConvert{
    static convert(from:string,to:string):number{
        return this.convertToPx(from) / this.convertToPx(to);
    }

    static convertToPx(unit:string):number{
        switch(unit){
            case 'px':
                return 1;
            case 'mm':
                return 3.78;
            case 'cm':
                return 37.8;
        }
    }
}