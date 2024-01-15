import { Entity } from "./utils/entity";
import { Globals } from "./globals";
import { InputManager, JoyAxis, JoyButton, Key, VAxis2D, VButton } from "./utils/input_manager";
import { Vec2 } from "./utils/la";
import { RailManager } from "./rail_manager";
import { Sprite } from "./utils/sprite";
import { clamp } from "./utils/math";
import { System, Window } from "cleo";
import { Bullet } from "./bullet";

export class Player extends Entity{
    spr: Sprite;
    input: InputManager;
    velocity: Vec2;
    gravity: number = 50;
    gravityScale: number = 0.3;
    jumpPower: number = 4;
    clamped: boolean = true;
    clampRange: number = 16;
    speed: number = 500;
    railManager: RailManager;
    moveAxis: VAxis2D;
    aimAxis: VAxis2D;
    jumpButton: VButton;
    fireButton: VButton;
    airControl: number = 50;
    state: 'clamped' | 'falling' = 'clamped';
    turretSpr: Sprite;
    aim: Vec2;
    turretPos: Vec2;
    constructor(){
        super();
        const tex = Globals.textureManager.get('bike');
        this.spr = new Sprite(tex,{
            // ox: tex.width/2,
            // oy: tex.height/2,
        });
        this.turretSpr = new Sprite(Globals.textureManager.get('turret'),{
            ox: 8, oy: 8, angle: 0,
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
        this.aimAxis = this.input.addAxis2D('aim');
        this.aimAxis.xAxis.addJoyAxis(0, JoyAxis.rx);
        this.aimAxis.yAxis.addJoyAxis(0, JoyAxis.ry);
        this.jumpButton = this.input.addButton('jump')
            .addKey(Key.space)
            .addJoyButton(0, JoyButton.a);
        this.fireButton = this.input.addButton('fire')
            .addMouseButton(0)
            .addJoyButton(0, JoyButton.rb);
        this.velocity = new Vec2();
        this.aim = new Vec2();
        this.railManager = Globals.railManager;
        this.turretPos = new Vec2();
    }
    isFalling(): boolean{
        if(!this.clamped) return true;
        if(this.velocity.y < 0) return true;
        for (const rail of this.railManager.rails) {
            if(rail === null) continue;
            const diff = 32;
            if(Math.abs(rail - this.position.y - diff) < this.clampRange) {
                this.position.y = rail - diff;
                return false;
            }
        }
        return true;
    }
    update(dt: number): void {
        if(this.input.getButton('uiBack').isPressed()) {Globals.paused = true; return;}
        // if(this.position.y > Window.height) this.position.y = 0;
        this.turretPos.x = this.position.x + 56;
        this.turretPos.y = this.position.y + 24;
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
        this.position.x = clamp(0, this.position.x, Globals.renderWidth);
        // handle turret
        const joyAim = this.aimAxis.getValue();
        if(joyAim.length() > 0){
            this.aim = joyAim;
            const angle = Math.atan2(this.aim.y, this.aim.x);
            this.turretSpr.properties.angle = angle;
        }
        else if(this.input.cursorChanged){
            this.aim = this.input.cursorPosition.copy().sub(this.turretPos);
            const angle = Math.atan2(this.aim.y, this.aim.x);
            this.turretSpr.properties.angle = angle;
        }
        if(this.fireButton.isPressed() && this.aim.length() > 0){
            this.aim.normalize();
            const bullet = new Bullet(Globals.playerBullets);
            bullet.velocity = this.aim.copy().mul(100);
            bullet.position = this.turretPos.copy();
        }
    }
    draw(){
        this.spr.draw(this.position.x, this.position.y);
        this.turretSpr.draw(this.turretPos.x, this.turretPos.y);
    }
    cleanup(): void {
        //
    }
}