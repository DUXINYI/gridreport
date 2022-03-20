import { PageRenderer } from "../report/concrete/renderer/PageRenderer.js";
import { IPageElement } from "../report/domain/description/IPageElement.js";
import { IPage } from "../report/domain/description/IPage.js";
import { FormatResolver } from "../report/concrete/renderer/FormatResolver.js";
import { Border } from "../report/concrete/description/Border.js";
import { Page } from "../report/concrete/description/Page.js";
import { Font } from "../report/concrete/description/Font.js";
import { Padding } from "../report/concrete/description/Padding.js";
import { PageElement } from "../report/concrete/description/PageElement.js";
import { Position } from "../report/concrete/description/Position.js";
import { Size } from "../report/concrete/description/Size.js";
import { TextSetting } from "../report/concrete/description/TextSetting.js";
import { FitContent } from "../report/concrete/description/FitContent.js";


var element:IPageElement= new PageElement(
    {
        backgroundColor:'bbb',
        border:new Border({
            leftColor:'888',
            leftStyle:'solid',
            leftWidth:1,
            rightColor:'888',
            rightStyle:'solid',
            rightWidth:1,
            topColor:'888',
            topStyle:'solid',
            topWidth:1,
            bottomColor:'888',
            bottomStyle:'solid',
            bottomWidth:1,
            borderTopLeftRadiusWidth:10,
            borderBottomLeftRadiusWidth:0,
            borderTopRightRadiusWidth:0,
            borderBottomRightRadiusWidth:0
        }),
        content: 'abcde',
        font:new Font({
            color:'ddd',
            fontFamily:'',
            fontSize:13,
            isBold:false,
            isItalic:false,
            isUnderline:false
        }),
        fitContent:new FitContent({
            fitHeight:false,
            fitWidth:false
        }),
        padding:new Padding({
            left:5,
            right:10,
            top:5,
            bottom:10
        }),
        position:new Position({
            x:10,
            y:20,
        }),
        size:new Size({
            w:38,
            h:70
        }),
        textSetting:new TextSetting({
            isWrapping:true,
            horizentalAlign:'left',
            verticalAlign:'left'
        })
    });

var page:IPage = new Page( {
    size:new Size({
        w:100,
        h:100,
    }),
    backgroundColor:'aaa',
    elements:[element],
});

var pr = new PageRenderer('mm',);

//普通渲染
var normal = pr.render(page);

document.body.appendChild(normal);

//文字超高超宽
element.content = '1234567890';
var contentOverflow = pr.render(page);
document.body.appendChild(contentOverflow);

//文字对齐
element.content = '123'
element.textSetting.horizentalAlign = 'center';
element.textSetting.verticalAlign = 'center';
var contentAlign = pr.render(page);
document.body.appendChild(contentAlign);

//文字不换行
element.textSetting.isWrapping = false;
var contentWrapping = pr.render(page);
document.body.appendChild(contentWrapping);

//文字宽度自适应
element.content = '1'
element.textSetting.horizentalAlign = 'right';
element.fitContent.fitWidth = true;
var fitWidth = pr.render(page);
document.body.appendChild(fitWidth);

//文字高度自适应
element.fitContent.fitHeight = true;
element.textSetting.verticalAlign = 'bottom';
var fitHeight = pr.render(page);
document.body.appendChild(fitHeight);

//外侧元素超高超宽
element.padding.left = 1000;
var paddingOverflow = pr.render(page);
document.body.appendChild(paddingOverflow);

//数据绑定
pr.elementRenderer.formatResolver = new FormatResolver(key=>key == 'test' ? 'PASSED' : 'FAILED');
element.padding.left = 0;
element.content = '[#test#]';
var contentBinding = pr.render(page);
document.body.appendChild(contentBinding);