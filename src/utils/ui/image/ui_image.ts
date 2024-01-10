import { Graphics } from "cleo";

/**
 * Scalable image for ui backgrounds and such
 */
export class UIImage{
    // abstract draw(x: number, y: number, width: number, height: number): void;
    texture: Graphics.Texture;
    constructor(texture: Graphics.Texture){
        this.texture = texture;
    }
    draw(x: number, y: number, width: number, height: number): void{
        this.texture.draw(x, y, {width, height});
    }
}