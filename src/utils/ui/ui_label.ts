import { Graphics, System } from "cleo";
import { SpriteSheet } from "../sprite_sheet";
import { Text } from "../text";
import { UINode } from "./ui_node";

export class UILabel extends UINode{
    get text(){return this.textComponent.text;}
    set text(str: string){this.textComponent.text = str}
    textComponent: Text;
    // charactersVisible: number = -1;
    constructor(parent: UINode | undefined, text: string){
        super(parent);
        // TODO: text renderer should come from style
        const tex = Graphics.Texture.fromFile('./sprites/font8x8.png');
        const sheet = new SpriteSheet(tex, 8, 8);
        this.textComponent = new Text(sheet, text);
    }
    fitText(){
        this.style.width = this.textComponent.width + this.style.marginLeft + this.style.marginRight; 
        this.style.height = this.textComponent.height + this.style.marginTop + this.style.marginBottom;
        // System.println('fitText', this.style.width, this.style.height);
        this.setDirty();
    }
    draw(x: number, y: number): void {
        this.textComponent.draw(x + this.style.padLeft, y + this.style.padRight);
        super.draw(x, y);
    }
}