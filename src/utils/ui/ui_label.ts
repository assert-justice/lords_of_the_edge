import { Graphics } from "cleo";
import { SpriteSheet } from "../sprite_sheet";
import { Text } from "../text";
import { UINode } from "./ui_node";

export class UILabel extends UINode{
    get text(){return this.textComponent.text;}
    set text(str: string){this.textComponent.text = str}
    textComponent: Text;
    // charactersVisible: number = -1;
    constructor(){
        super();
        // TODO: text renderer should come from style
        const tex = Graphics.Texture.fromFile('./sprites/font8x8.png');
        const sheet = new SpriteSheet(tex, 8, 8);
        this.textComponent = new Text(sheet);
    }
    draw(x: number, y: number): void {
        this.drawBackground(x, y);
        this.textComponent.draw(x, y);
        this.drawChildren(x, y);
    }
}