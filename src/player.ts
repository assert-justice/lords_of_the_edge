import { Entity } from "./utils/entity";
import { Globals } from "./globals";
import { InputManager, JoyAxis, JoyButton, Key, VAxis2D, VButton } from "./utils/input_manager";
import { Vec2 } from "./utils/la";
import { RailManager } from "./rail_manager";
import { Sprite } from "./utils/sprite";
import { clamp } from "./utils/math";
import { Window } from "cleo";

export class Player extends Entity{
    spr: Sprite;
    input: InputManager;
    velocity: Vec2;
    gravity: number = 50;
    gravityScale: number = 0.3;
    jumpPower: number = 8;
    clamped: boolean = true;
    clampRange: number = 30;
    speed: number = 500;
    railManager: RailManager;
    moveAxis: VAxis2D;
    jumpButton: VButton;
    airControl: number = 50;
    state: 'clamped' | 'falling' = 'clamped';
    constructor(){
        super();
        const tex = Globals.textureManager.get('bike');
        this.spr = new Sprite(tex,{
            ox: tex.width/2,
            oy: tex.height/2,
        });
        this.input = Globals.inputManager;
        this.moveAxis = this.input.addAxis2D('move');
        this.moveAxis.xAxis
            .addKeyPositive(Key.d)
            .addKeyNegative(Key.a)
            .addJoyAxis(0, JoyAxis.lx)
        this.moveAxis.yAxis
            .addKeyPositive(Key.s)
            .addJoyAxis(0, JoyAxis.ly);
        this.jumpButton = this.input.addButton('jump')
            .addKey(Key.space)
            .addJoyButton(0, JoyButton.a);
        this.velocity = new Vec2();
        this.railManager = Globals.railManager;
    }
    isFalling(): boolean{
        if(!this.clamped) return true;
        if(this.velocity.y < 0) return true;
        for (const rail of this.railManager.rails) {
            if(rail === null) continue;
            const diff = 40;
            if(Math.abs(rail - this.position.y - diff) < this.clampRange) {
                this.position.y = rail - diff;
                return false;
            }
        }
        return true;
    }
    update(dt: number): void {
        super.update(dt);
        if(this.input.getButton('uiBack').isPressed()) {Globals.paused = true; return;}
        if(this.position.y > Window.height) this.position.y = 0;
        const move = this.moveAxis.getValue();
        this.clamped = !(move.y > 0.7); 
        if(this.isFalling()){
            this.velocity.x += this.airControl * dt * move.x;
            this.velocity.x = Math.min(this.speed * dt, Math.max(-this.speed * dt, this.velocity.x));
            this.position.add(this.velocity);
            this.velocity.y += this.gravity * dt * (this.jumpButton.isDown() ? this.gravityScale : 1);
            this.position.add(this.velocity);    
        }
        else{
            this.velocity.x = 1.3 * this.speed * dt * move.x;
            this.velocity.y = 0;
            if(this.jumpButton.isPressed()){
                this.velocity.y = -this.jumpPower;
            }
            this.position.add(this.velocity);
        }
        this.position.x = clamp(0, this.position.x, Window.width);
    }
    draw(){
        super.draw();
        this.spr.draw(this.position.x, this.position.y);
    }
}