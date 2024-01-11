import { System } from "cleo";
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

type PlaceFn = (lastVal: number, node: UINode)=>[number, number];

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
    getChildrenBounds(): [number, number]{
        let boundsWidth = 0; let boundsHeight = 0;
        if(this.style.flowDirection === 'vertical'){
            for (const child of this.children) {
                const w = child.getTotalWidth();
                const h = child.getTotalHeight();
                if(w > boundsWidth) boundsWidth = w;
                boundsHeight += h;
            }
        }
        else{ // flowDirection is horizontal
            for (const child of this.children) {
                const w = child.getTotalWidth();
                const h = child.getTotalHeight();
                boundsWidth += w;
                if(h > boundsHeight) boundsHeight = h;
            }
        }
        return [boundsWidth, boundsHeight];
    }
    getAnchorCoords(x: number, y: number, xAlign: string, yAlign: string, boundsWidth: number, boundsHeight: number): [number, number]{
        let anchorX = x; let anchorY = y;
        if(xAlign === 'l'){
            anchorX += this.style.padLeft + this.style.marginLeft;
        }
        else if(xAlign === 'r'){
            anchorX += this.getTotalWidth() - boundsWidth - this.style.padRight - this.style.marginRight;
        }
        else{ // centered on x axis
            anchorX += (this.getTotalWidth() - boundsWidth) / 2;
        }
        if(yAlign === 't'){
            anchorY += this.style.padTop + this.style.marginTop;
        }
        else if(yAlign === 'b'){
            anchorY += this.getTotalHeight() - boundsHeight - this.style.padBottom - this.style.marginBottom;
        }
        else{ // centered on y axis
            anchorY = (this.getTotalHeight() - boundsHeight) / 2;
        }
        return [anchorX, anchorY];
    }
    draw(x: number, y: number){
        if(this.style.background){
            this.style.background.draw(
                x + this.style.padLeft,
                y + this.style.padTop,
                this.style.width, 
                this.style.height
            );
        }
        if(this.children.length === 0) return;

        let xPlaceFn: PlaceFn;// = (lastVal)=>lastVal;
        let yPlaceFn: PlaceFn;// = (lastVal)=>lastVal;
        let xAlign: 'l' | 'r' | '' = '';
        let yAlign: 't' | 'b' | '' = '';
        if(this.style.anchorMode.includes('l')) xAlign = 'l';
        else if(this.style.anchorMode.includes('r')) xAlign = 'r';
        if(this.style.anchorMode.includes('t')) yAlign = 't';
        else if(this.style.anchorMode.includes('b')) yAlign = 'b';
        const [boundsWidth, boundsHeight] = this.getChildrenBounds();
        const [xAnchor, yAnchor] = this.getAnchorCoords(x, y, xAlign, yAlign, boundsWidth, boundsHeight);
        // System.println(boundsWidth, boundsHeight);
        // System.println(xAnchor, yAnchor);
        if(this.style.flowDirection === 'vertical'){
            yPlaceFn = (lastVal, node) => [lastVal, lastVal + node.getTotalHeight()];
            if(xAlign === 'l') xPlaceFn = (lastVal)=>[lastVal, lastVal];
            else if(xAlign === 'r') 
                xPlaceFn = (lastVal, node)=>[lastVal + boundsWidth - node.getTotalWidth(), lastVal];
            else
                xPlaceFn = (lastVal, node)=>[lastVal + (boundsWidth - node.getTotalWidth()) / 2, lastVal];
        }
        else{
            xPlaceFn = (lastVal, node) => [lastVal, lastVal + node.getTotalWidth()];
            if(yAlign === 't') yPlaceFn = (lastVal)=>[lastVal, lastVal];
            else if(yAlign === 'b')
                yPlaceFn = (lastVal, node)=>[lastVal + boundsHeight - node.getTotalHeight(), lastVal];
            else
                yPlaceFn = (lastVal, node)=>[lastVal + (boundsHeight - node.getTotalHeight()), lastVal];
        }
        let cx = xAnchor; let cy = yAnchor;
        for (const child of this.children) {
            const [myX, myNextX] = xPlaceFn(cx, child);
            const [myY, myNextY] = yPlaceFn(cy, child);
            child.draw(myX, myY);
            // System.println(myX, myY);
            cx = myNextX; cy = myNextY;
            // const w = child.getTotalWidth();
            // const h = child.getTotalHeight();
            // if(w > boundsWidth) boundsWidth = w;
            // boundsHeight += h;
        }
        // }
        // else{ // flowDirection is horizontal
        //     for (const child of this.children) {
        //         const w = child.getTotalWidth();
        //         const h = child.getTotalHeight();
        //         boundsWidth += w;
        //         if(h > boundsHeight) boundsHeight = h;
        //     }
        // }
        // right now let's just worry about tl anchor and vertical flow
        // x += this.style.padLeft; 
        // y += this.style.padTop;
        // if(this.style.background){
        //     this.style.background.draw(x,y,this.style.width, this.style.height);
        // }
        // x += this.style.marginLeft; 
        // y += this.style.marginTop;
        // for (const child of this.children) {
        //     child.draw(x, y);
        //     y += child.getTotalHeight();
        // }
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