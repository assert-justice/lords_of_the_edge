import { Graphics } from "cleo";
import { Globals } from "./globals";

export class Progress{
    height = 10;
    whiteTex: Graphics.Texture;
    blackTex: Graphics.Texture;
    diamondTex: Graphics.Texture;
    constructor(){
        this.whiteTex = Graphics.Texture.fromColor(1, 1, 255, 255, 255, 255);
        this.blackTex = Graphics.Texture.fromColor(1, 1, 0, 0, 0, 255);
        const data = new ArrayBuffer(this.height * this.height * 4);
        const view = new Uint8Array(data);
        const cx = this.height / 2;
        const cy = this.height / 2;
        let idx = 0;
        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.height; x++){
                const dis = Math.abs(cx - x) + Math.abs(cy - y);
                if(dis < this.height / 2){
                    view[idx] = 255;
                    view[idx+1] = 255;
                    view[idx+2] = 255;
                    view[idx+3] = 255;
                }
                idx+=4;
            }
        }
        this.diamondTex = Graphics.Texture.new(this.height, this.height, data);
    }
    draw(progress: number){
        const top = Globals.renderHeight - this.height;
        this.blackTex.draw(0, top, {width: Globals.renderWidth, height: this.height});
        const thickness = 2;
        const [x, y, w, h] = [
            0, 
            Globals.renderHeight - (this.height + thickness) / 2,
            Globals.renderWidth,
            thickness,
        ];
        this.whiteTex.draw(x, y, {width: w, height: h});
        this.diamondTex.draw(progress * Globals.renderWidth - this.height/2, top);
    }
}