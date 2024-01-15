import { Globals } from "./globals";
import { Entity } from "./utils/entity";
import { Vec2 } from "./utils/la";
import { Pool } from "./utils/pool";
import { Sprite } from "./utils/sprite";

export class Bullet extends Entity{
    velocity: Vec2;
    sprite: Sprite;
    pool: Pool<Entity>;
    constructor(pool: Pool<Entity>){
        super();
        this.pool = pool;
        this.velocity = new Vec2();
        this.sprite = new Sprite(Globals.textureManager.get('player_bullet'),{ox: 4, oy: 4});
        pool.add(this);
    }
    draw(): void {
        this.sprite.draw(this.position.x, this.position.y);
    }
    update(dt: number): void {
        this.position.add(this.velocity.copy().mul(dt));
        // delete if offscreen
        if(this.position.x < -5 || this.position.x > Globals.renderWidth + 5) this.cleanup();
        if(this.position.y < -5 || this.position.y > Globals.renderHeight + 5) this.cleanup();
    }
    cleanup(){
        this.pool.remove(this);
    }
}