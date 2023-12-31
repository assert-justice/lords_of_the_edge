import { Vec2 } from "./la";

export class Entity{
    position: Vec2;
    constructor(){
        this.position = new Vec2();
    }
    update(dt: number){}
    draw(){}
}