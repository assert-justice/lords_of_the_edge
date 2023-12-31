import { Entity } from "./utils/entity";
import { Vec2 } from "./utils/la";

export class Bullet extends Entity{
    velocity: Vec2;
    constructor(){
        super();
        this.velocity = new Vec2();
    }
}