
import { FormatResolver } from "../report/concrete/renderer/formatresolver/FormatResolver.js";
import { PageRenderer } from "../report/concrete/renderer/PageRenderer.js";
import { IPage } from "../report/domain/description/IPage.js";


const windowAny = <any>window;



var resolver = new FormatResolver()
var pr = new PageRenderer({
    defaultLengthUnit:'mm',
    formatResolver:resolver,
    qrcodeRequestUrl:'https://pic1.zhimg.com/v2-d45cad87d837c99bf7866c2ab4fe13a3_l.jpg?source=32738c0c&'
});

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
