import { Vec2 } from "./la";

export abstract class Entity{
    position: Vec2;
    constructor(){
        this.position = new Vec2();
    }
    abstract update(dt: number): void;
    abstract draw(): void;
    abstract cleanup(): void;
}