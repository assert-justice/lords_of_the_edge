import { Graphics, System } from "cleo";
import { UIImage } from "./ui_image";

export class UIImageColor extends UIImage{
    constructor(red: number, green: number, blue: number, alpha: number){
        // creates a tiny texture for itself
        super(Graphics.Texture.fromColor(1, 1, red, green, blue, alpha));
    }
}