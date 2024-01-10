import { Vec2 } from "../la";
import { UIImage } from "./image/ui_image";
import { UIStyle, UIStyleManager, getDefaultStyle } from "./ui_style";

interface Dimension{
    value: number,
    mode: 'px' | '%',
}

function dimensionDecode(dimension: string): [number, 'px' | '%']{
    const startDimension = dimension;
    dimension = dimension.trim();
    let mode: 'px' | '%' = 'px';
    if(dimension.endsWith('px')){
        mode = 'px';
        dimension = dimension.slice(0, dimension.length-2);
    }
    else if(dimension.endsWith('%')){
        mode = '%';
        dimension = dimension.slice(0, dimension.length-1);
    }
    const value = Number(dimension);
    if(Number.isNaN(value)){
        throw `Invalid dimension '${startDimension}'.`;
    }
    return [value, mode];
}

export class UINode{
    parent?: UINode = undefined;
    children: UINode[] = [];
    // position: Vec2;
    // styleType: string;
    // styleId?: string;
    styleClass?: string;
    // styleManager: UIStyleManager;
    style: UIStyle;
    onMount: (node: UINode)=>void = ()=>{};
    onUnmount: (node: UINode)=>void = ()=>{};
    onFocus: (node: UINode)=>void = ()=>{};
    onUnfocus: (node: UINode)=>void = ()=>{};
    onSelect: (node: UINode)=>void = ()=>{};
    onBack: (node: UINode)=>void = ()=>{};
    constructor(){
    // constructor(styleManager?: UIStyleManager){
        // if(styleManager === undefined) {
        //     this.styleManager = new UIStyleManager();
        // }
        // else{
        //     this.styleManager = styleManager;
        // }
        // this.position = new Vec2();
        // this.styleType = 'node';
        // this.style = this.styleManager.match(this);
        this.style = getDefaultStyle();
    }
    getParent(){
        return this.parent;
    }
    setParent(parent?: UINode){
        if(parent === undefined) return;
        if(parent === this.parent) return;
        if(this.parent !== undefined) this.parent.removeChild(this);
        parent.addChild(this);
    }
    getChildren(){
        return this.children;
    }
    addChild(child: UINode){
        this.children.push(child);
    }
    removeChild(child: UINode){
        this.children = this.children.filter(c => c !== child);
    }
    getTotalWidth(){return this.style.width + this.style.padLeft + this.style.padRight;}
    getTotalHeight(){return this.style.height + this.style.padTop + this.style.padBottom;}
    draw(x: number, y: number){
        // right now let's just worry about tl anchor and vertical flow
        x += this.style.padLeft; 
        y += this.style.padTop;
        if(this.style.background){
            this.style.background.draw(x,y,this.style.width, this.style.height);
        }
        x += this.style.marginLeft; 
        y += this.style.marginTop;
        for (const child of this.children) {
            child.draw(x, y);
            y += child.getTotalHeight();
        }
    }
    // setDimensions(width: string, height: string){
    //     let [widthValue, widthMode] = dimensionDecode(width);
    //     let [heightValue, heightMode] = dimensionDecode(height);
    //     if(widthMode === 'px'){}
    //     else if(widthMode === '%'){}
    // }
    // setDimensionsPx(width: number, height: number){
    //     if(this.parent === undefined){
    //         // If the current node is root, our dimensions are in px already.
    //         this.width = width; this.height = height;
    //     }
    //     else{
    //         // If the current node is not the root, translate the width to ratio.
    //         this.width = 
    //     }
    // }
}