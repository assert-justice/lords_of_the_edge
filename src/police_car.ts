import { Globals } from "./globals";
import { Entity } from "./utils/entity";
import { Sprite } from "./utils/sprite";

export class PoliceCar extends Entity{
    spr: Sprite;
    constructor(){
        super();
        const tex = Globals.textureManager.get('police_car');
        const scale = 0.3;
        this.spr = new Sprite(tex, {
            width: tex.width * scale,
            height: tex.height * scale,
        });
    }
    draw(){
        this.spr.draw(this.position.x, this.position.y);
    }
    update(dt: number): void {
        //
    }
    cleanup(): void {
        //
    }
}