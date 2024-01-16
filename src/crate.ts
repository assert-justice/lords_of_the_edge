import { Globals } from "./globals";
import { Entity } from "./utils/entity";
import { SpriteSheet } from "./utils/sprite_sheet";

export class Crate extends Entity{
    spriteSheet: SpriteSheet;
    constructor(){
        super();
        const tex = Globals.textureManager.get('crate');
        this.spriteSheet = new SpriteSheet(tex, tex.width / 2, tex.height);
    }
    init(): void {
        //
    }
    update(dt: number): void {
        //
    }
    draw(): void {
        this.spriteSheet.draw(this.position.x, this.position.y);
    }
    cleanup(): void {
        //
    }
}