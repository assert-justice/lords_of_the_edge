import { Graphics } from "cleo";
import { App } from "./utils/app";
import { Scene } from "./utils/scene";
import { UIImageColor } from "./utils/ui/ui_image_color";
import { UINineSlice } from "./utils/ui/ui_nine_slice";
import { UINode } from "./utils/ui/ui_node";
import { UILabel } from "./utils/ui/ui_label";

export class MenuScene extends Scene{
    panel: UINode;
    constructor(app: App){
        super(app);
        this.panel = new UIImageColor(undefined, 255, 255, 255, 255);
        this.panel.style = {
            ...this.panel.style,
            width: 1000,
            height: 1000,
            // flowDirection: 'horizontal',
            anchorMode: 'c',
            // backgrounds: [new UIImageColor(255, 255, 255, 255)],
        };
        const lines = [
            'With the lights out, it\'s less dangerous',
            'Here we are now, entertain us',
            'I feel stupid and contagious',
            'Here we are now, entertain us',
            'A mulatto, an albino',
            'A mosquito, my libido',
        ];

        // const label = new UILabel();
        // label.text = 'Hello World!';
        // this.panel.addChild(label);
        const gridImg = Graphics.Texture.fromFile('./sprites/gridBackground.png');
        for (const line of lines) {
            const border = new UINineSlice(this.panel, gridImg, 7, 7, 18, 18);
            border.style = {
                ...border.style,
                marginLeft: 7,
                marginRight: 7,
                marginTop: 7,
                marginBottom: 7,
            };
            const label = new UILabel(border, '\n\n'+line+'\n\n');
            label.fitText();
            border.fitChildren();
        }
        // for(let i = 0; i < 3; i++){
        //     const child = new UINineSlice(gridImg, 7, 7, 18, 18);
        //     child.style = {
        //         ...child.style,
        //         width: 50 * (i+1),
        //         height: 50 * (i+1),
        //     };
        //     this.panel.addChild(child);
        // }
        // this.panel.background = new UIImageColor(255, 0, 0, 255);
        // this.panel.setDimensionsPixels(200, 100);
    }
    draw(){
        this.panel.draw(0, 0);
    }
}