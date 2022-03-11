import { FormatResolver } from "../report/concrete/renderer/FormatResolver.js";
import { PageRenderer } from "../report/concrete/renderer/PageRenderer.js";
import { IPage } from "../report/domain/description/IPage.js";


const windowAny = <any>window;



var resolver = new FormatResolver()
var pr = new PageRenderer('mm',resolver);


windowAny.render = function(page:IPage | string,data:any){

    resolver.bindingHandler = (key:string):string=>data[key] || ''

    document.body.innerHTML = '';
    var normal; 
    if(typeof page == 'string'){
        normal = pr.render(JSON.parse(<string>page));
    }else{
        normal = pr.render(<IPage>page);
    }
    document.body.appendChild(normal);
}
