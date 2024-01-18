import { Vec2 } from "./la";

export class AABB{
    position: Vec2;
    width: number;
    height: number;
    constructor(position: Vec2, width: number, height: number){
        this.position = position; this.width = width; this.height = height;
    }
    collidePoint(pos: Vec2): boolean{
        if(pos.x < this.position.x || pos.y < this.position.y) return false;
        if(pos.x > this.position.x + this.width || pos.y > this.position.y + this.height) return false;
        return true;
    }
}