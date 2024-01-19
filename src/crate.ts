import { Bullet } from "./bullet";
import { Globals } from "./globals";
import { AABB } from "./utils/aabb";
import { Entity } from "./utils/entity";
import { Vec2 } from "./utils/la";
import { SpriteSheet } from "./utils/sprite_sheet";

export class Crate extends Entity{
    spriteSheet: SpriteSheet;
    boundingBox: AABB;
    velocity: Vec2;
    health = 30;
    redTime = 0.1;
    redClock = 0;
    constructor(){
        super();
        const tex = Globals.textureManager.get('crate');
        this.spriteSheet = new SpriteSheet(tex, tex.width / 2, tex.height);
        this.boundingBox = new AABB(this.position, tex.width, tex.height);
        this.velocity = new Vec2();
    }
    init(): void {
        this.velocity.mul(0);
    }
    update(dt: number): void {
        for (const bullet of Globals.playerBullets.values()) {
            const b = bullet as Bullet;
            if(this.boundingBox.collidePoint(bullet.position)) {
                this.damage(b.damage);
                b.cleanup();
            }
        }
        if(this.redClock > 0){
            this.redClock -= dt;
            if(this.redClock <= 0){
                this.spriteSheet.setTile(0);
            }
        }
        this.position.add(this.velocity.copy().mul(dt));
    }
    draw(): void {
        this.spriteSheet.draw(this.position.x, this.position.y);
    }
    damage(d: number){
        this.health -= d;
        if(this.health < 0) {
            this.cleanup();
            return;
        }
        this.spriteSheet.setTile(1);
        this.redClock = this.redTime;
    }
}