import { Engine, Window, Input, Graphics } from "cleo";
import { Game } from "./game";
import { App } from "./utils/app";
import { MenuScene } from "./menu_scene";
import { Globals } from "./globals";
import { RailManager } from "./rail_manager";
// internal resolution: 640, 360
Window.setStats('Lords of the Edge', 1920, 1080);

export class Main extends App{
    renderTexture: Graphics.Texture;
    menuScene: MenuScene;
    constructor(){
        super();
        this.sceneStore.set('game', ()=>new Game(this));
        this.menuScene = new MenuScene(this);
        // this.sceneStore.set('menu', ()=>new MenuScene(this));
        // this.setScene('menu');
        this.renderTexture = Graphics.Texture.new(Globals.renderWidth, Globals.renderHeight);
        Globals.textureManager
        .add('bike', './sprites/bike.png')
        .add('pallet', './sprites/pallet.png')
        .add('turret', './sprites/turret.png')
        .add('police_car', './sprites/police_car_no_siren.png')
        Globals.railManager = new RailManager();
    }
    draw(): void {
        this.renderTexture.setTarget();
        Graphics.clear();
        super.draw();
        if(Globals.paused) this.menuScene.draw();
        this.renderTexture.resetTarget();
        this.renderTexture.draw(0,0, {width: Window.width, height: Window.height});
    }
    update(dt: number): void {
        Globals.inputManager.poll();
        if(Globals.paused){
            this.menuScene.update(dt);
        }
        else{
            super.update(dt);
        }
    }
}

Engine.init = ()=>{
    Globals.init();
    const main = new Main();
    Engine.update = (dt: number)=>{
        main.update(dt);
    };
    Engine.draw = ()=>{
        main.draw();
    };
}