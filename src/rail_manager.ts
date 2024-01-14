import { Sprite } from "./utils/sprite";
import { Globals } from "./globals";

export class RailManager{
    rails: (number | null)[];
    spr: Sprite;
    constructor(){
        this.rails = [];
        this.spr = new Sprite(Globals.textureManager.get('pallet'),{
            width: Globals.renderWidth,
            height: 3,
            sx: 5,
            sw: 1,
            sh: 1,
        });
        const height = Globals.renderHeight;
        const numRails = 5;
        const railHeight = height/(numRails + 1);
        for(let i = 0; i < numRails; i++){
            this.rails.push((i+1) * railHeight);
        }
    }
    draw(){
        for (const rail of this.rails) {
            if(rail !== null) this.spr.draw(0, rail);
        }
    }
}