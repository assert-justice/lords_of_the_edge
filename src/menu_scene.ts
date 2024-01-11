import { Graphics } from "cleo";
import { App } from "./utils/app";
import { Scene } from "./utils/scene";
import { UIImageColor } from "./utils/ui/image/ui_image_color";
import { UINineSlice } from "./utils/ui/image/ui_nine_slice";
import { UINode } from "./utils/ui/ui_node";

export class MenuScene extends Scene{
    panel: UINode;
    constructor(app: App){
        super(app);
        this.panel = new UINode();
        this.panel.style = {
            ...this.panel.style,
            width: 1000,
            height: 1000,
            // flowDirection: 'horizontal',
            anchorMode: 'c',
            backgrounds: [new UIImageColor(255, 255, 255, 255)],
        };
        const gridImg = Graphics.Texture.fromFile('./sprites/gridBackground.png');
        for(let i = 0; i < 3; i++){
            const child = new UINode();
            child.style = {
                ...child.style,
                width: 50 * (i+1),
                height: 50 * (i+1),
                backgrounds: [new UINineSlice(gridImg, 7, 7, 18, 18)],
            };
            this.panel.addChild(child);
        }
        // this.panel.background = new UIImageColor(255, 0, 0, 255);
        // this.panel.setDimensionsPixels(200, 100);
    }
    draw(){
        this.panel.draw(0, 0);
    }
}